package com.sentinel.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Contacts
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ReportProblem
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import com.sentinel.app.ui.theme.CardDark
import com.sentinel.app.ui.theme.InkOnAccent
import com.sentinel.app.ui.theme.NeonBlue
import com.sentinel.app.ui.theme.TextGray
import com.sentinel.app.utils.Screen

private data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    // Routes that are part of this tab's flow (keep the tab selected
    // while the user drills deeper, e.g. Route -> Route Recommendation).
    val childRoutes: Set<String> = emptySet()
)

private val bottomNavItems = listOf(
    BottomNavItem(Screen.Home.route, "Home", Icons.Filled.Home),
    BottomNavItem(
        Screen.SafeRoute.route,
        "Route",
        Icons.Filled.Navigation,
        childRoutes = setOf(Screen.RouteRecommendation.route)
    ),
    BottomNavItem(Screen.Report.route, "Report", Icons.Filled.ReportProblem),
    BottomNavItem(Screen.Contacts.route, "Contacts", Icons.Filled.Contacts),
    BottomNavItem(Screen.Profile.route, "Profile", Icons.Filled.Person)
)

/** Routes that should display the persistent bottom navigation bar. */
val bottomBarRoutes: Set<String> =
    bottomNavItems.flatMap { listOf(it.route) + it.childRoutes }.toSet()

@Composable
fun SentinelBottomBar(
    navController: NavController,
    currentRoute: String?
) {
    NavigationBar(
        containerColor = CardDark,
        tonalElevation = 0.dp
    ) {
        bottomNavItems.forEach { item ->
            val selected =
                currentRoute == item.route || currentRoute in item.childRoutes
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(
                                navController.graph.findStartDestination().id
                            ) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label
                    )
                },
                label = { Text(item.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = InkOnAccent,
                    selectedTextColor = NeonBlue,
                    indicatorColor = NeonBlue,
                    unselectedIconColor = TextGray,
                    unselectedTextColor = TextGray
                )
            )
        }
    }
}
