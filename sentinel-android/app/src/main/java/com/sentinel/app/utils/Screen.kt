package com.sentinel.app.utils

/**
 * Single source of truth for all navigation routes.
 * Add new destinations here instead of using raw strings.
 */
sealed class Screen(
    val route: String
) {
    // Entry / auth flow
    data object Splash : Screen("splash")
    data object Onboarding : Screen("onboarding")
    data object Login : Screen("login")
    data object Register : Screen("register")

    // Main app
    data object Home : Screen("home")
    data object Maps : Screen("maps")
    data object Report : Screen("report")
    data object Contacts : Screen("contacts")
    data object History : Screen("history")
    data object Profile : Screen("profile")

    // Routing / journey
    data object SafeRoute : Screen("safe_route")
    data object RouteRecommendation : Screen("route_recommendation")
    data object JourneyDashboard : Screen("journey_dashboard")
}
