package com.sentinel.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.sentinel.app.screens.EmergencyContactsScreen
import com.sentinel.app.screens.HistoryScreen
import com.sentinel.app.screens.HomeScreen
import com.sentinel.app.screens.JourneyDashboardScreen
import com.sentinel.app.screens.LoginScreen
import com.sentinel.app.screens.MapScreen
import com.sentinel.app.screens.OnboardingScreen
import com.sentinel.app.screens.ProfileScreen
import com.sentinel.app.screens.RegisterScreen
import com.sentinel.app.screens.ReportScreen
import com.sentinel.app.screens.RouteRecommendationScreen
import com.sentinel.app.screens.SafeRouteScreen
import com.sentinel.app.screens.SplashScreen
import com.sentinel.app.ui.components.SentinelBottomBar
import com.sentinel.app.ui.components.bottomBarRoutes
import com.sentinel.app.ui.theme.BackgroundBlack
import com.sentinel.app.ui.theme.SentinelTheme
import com.sentinel.app.utils.Screen
import com.sentinel.app.utils.SessionManager
import com.sentinel.app.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            SentinelTheme {
                val navController = rememberNavController()
                val viewModel: MainViewModel = viewModel()
                val sessionManager = SessionManager(this)

                val backStackEntry by navController
                    .currentBackStackEntryAsState()
                val currentRoute = backStackEntry?.destination?.route

                Scaffold(
                    containerColor = BackgroundBlack,
                    bottomBar = {
                        if (currentRoute in bottomBarRoutes) {
                            SentinelBottomBar(
                                navController = navController,
                                currentRoute = currentRoute
                            )
                        }
                    }
                ) { innerPadding ->

                    NavHost(
                        navController = navController,
                        startDestination = Screen.Splash.route,
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {

                        composable(Screen.Splash.route) {
                            SplashScreen(navController, sessionManager)
                        }

                        composable(Screen.Onboarding.route) {
                            OnboardingScreen(navController)
                        }

                        composable(Screen.Login.route) {
                            LoginScreen(viewModel) {
                                navController.navigate(Screen.Home.route) {
                                    popUpTo(Screen.Login.route) {
                                        inclusive = true
                                    }
                                }
                            }
                        }

                        composable(Screen.Register.route) {
                            RegisterScreen(viewModel) {
                                navController.navigate(Screen.Home.route)
                            }
                        }

                        composable(Screen.Home.route) {
                            HomeScreen(navController)
                        }

                        composable(Screen.Maps.route) {
                            MapScreen(viewModel = viewModel)
                        }

                        composable(Screen.Report.route) {
                            ReportScreen(viewModel)
                        }

                        composable(Screen.Contacts.route) {
                            EmergencyContactsScreen()
                        }

                        composable(Screen.History.route) {
                            HistoryScreen()
                        }

                        composable(Screen.Profile.route) {
                            ProfileScreen(navController)
                        }

                        composable(Screen.SafeRoute.route) {
                            SafeRouteScreen(
                                navController = navController,
                                viewModel = viewModel
                            )
                        }

                        composable(Screen.RouteRecommendation.route) {
                            RouteRecommendationScreen(viewModel = viewModel)
                        }

                        composable(Screen.JourneyDashboard.route) {
                            JourneyDashboardScreen(viewModel)
                        }
                    }
                }
            }
        }
    }
}
