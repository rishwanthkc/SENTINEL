package com.sentinel.app.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sentinel.app.ui.theme.*
import com.sentinel.app.viewmodel.MainViewModel
import com.sentinel.app.utils.SessionManager

@Composable
fun LoginScreen(
    viewModel: MainViewModel,
    onSuccess: () -> Unit
) {

    var email by remember {
        mutableStateOf("")
    }

    val context = LocalContext.current
    val sessionManager =
        SessionManager(context)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        BackgroundBlack,
                        DarkBlue,
                        DeepNavy
                    )
                )
            )
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),

            verticalArrangement = Arrangement.Center
        ) {

            Card(
                modifier = Modifier.fillMaxWidth(),

                colors = CardDefaults.cardColors(
                    containerColor = CardDark
                ),

                shape = RoundedCornerShape(28.dp)
            ) {

                Column(
                    modifier = Modifier
                        .padding(24.dp)
                ) {

                    Text(
                        text = "WELCOME",

                        color = NeonBlue,

                        fontSize = 40.sp,

                        fontWeight = FontWeight.Bold
                    )

                    Spacer(
                        modifier = Modifier.height(8.dp)
                    )

                    Text(
                        text = "Login to continue",

                        color = TextGray,

                        fontSize = 18.sp
                    )

                    Spacer(
                        modifier = Modifier.height(32.dp)
                    )

                    OutlinedTextField(
                        value = email,

                        onValueChange = {
                            email = it
                        },

                        label = {
                            Text("Email")
                        },

                        modifier = Modifier.fillMaxWidth(),

                        shape = RoundedCornerShape(20.dp),

                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonBlue,
                            unfocusedBorderColor = TextGray,
                            focusedLabelColor = NeonBlue,
                            cursorColor = NeonBlue
                        )
                    )

                    Spacer(
                        modifier = Modifier.height(32.dp)
                    )

                    Button(
                        onClick = {

                            if (email.isNotEmpty()) {

                                viewModel.loginUser(
                                    email
                                ) { message ->

                                    Toast.makeText(
                                        context,
                                        message,
                                        Toast.LENGTH_SHORT
                                    ).show()

                                    if (
                                        message.contains(
                                            "successful",
                                            ignoreCase = true
                                        )
                                    ) {
                                        sessionManager.saveLoginSession(
                                            email
                                        )
                                        onSuccess()
                                    }
                                }
                            }
                        },

                        modifier = Modifier
                            .fillMaxWidth()
                            .height(60.dp),

                        colors = ButtonDefaults.buttonColors(
                            containerColor = NeonBlue
                        ),

                        shape = RoundedCornerShape(22.dp)
                    ) {

                        Text(
                            text = "LOGIN",

                            color = BackgroundBlack,

                            fontSize = 20.sp,

                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}