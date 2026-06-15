package com.sentinel.app.services

import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import com.sentinel.app.MainActivity
import com.sentinel.app.R
import kotlin.math.abs

/**
 * Rapido-style floating bubble shown while a journey is active.
 * Draggable; a tap re-opens the app. Requires the "Display over other
 * apps" permission — if it isn't granted the bubble is silently skipped
 * (the persistent notification still keeps the journey visible).
 */
class HoverBubble(private val context: Context) {

    private var windowManager: WindowManager? = null
    private var bubble: View? = null

    fun show() {
        if (bubble != null) return
        if (!Settings.canDrawOverlays(context)) return

        windowManager =
            context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val sizePx = (58 * context.resources.displayMetrics.density).toInt()

        val view = ImageView(context).apply {
            setImageResource(R.mipmap.ic_launcher)
            val ring = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(0xFF0B1B33.toInt())
                setStroke(
                    (2 * context.resources.displayMetrics.density).toInt(),
                    0xFF34D6E6.toInt()
                )
            }
            background = ring
            val pad = (10 * context.resources.displayMetrics.density).toInt()
            setPadding(pad, pad, pad, pad)
        }

        val type =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                @Suppress("DEPRECATION")
                WindowManager.LayoutParams.TYPE_PHONE

        val params = WindowManager.LayoutParams(
            sizePx,
            sizePx,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 24
        params.y = 240

        var initialX = 0
        var initialY = 0
        var touchX = 0f
        var touchY = 0f
        var moved = false

        view.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    touchX = event.rawX
                    touchY = event.rawY
                    moved = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - touchX).toInt()
                    val dy = (event.rawY - touchY).toInt()
                    if (abs(dx) > 12 || abs(dy) > 12) moved = true
                    params.x = initialX + dx
                    params.y = initialY + dy
                    windowManager?.updateViewLayout(view, params)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (!moved) openApp()
                    true
                }
                else -> false
            }
        }

        try {
            windowManager?.addView(view, params)
            bubble = view
        } catch (_: Exception) {
            bubble = null
        }
    }

    private fun openApp() {
        val intent = Intent(context, MainActivity::class.java)
        intent.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        )
        context.startActivity(intent)
    }

    fun hide() {
        bubble?.let {
            try {
                windowManager?.removeView(it)
            } catch (_: Exception) {
            }
        }
        bubble = null
    }
}
