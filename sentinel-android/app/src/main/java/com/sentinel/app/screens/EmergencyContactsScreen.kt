package com.sentinel.app.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

import androidx.compose.foundation.shape.RoundedCornerShape

import androidx.compose.material3.*

import androidx.compose.runtime.*

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

import androidx.compose.ui.graphics.Brush

import androidx.compose.ui.text.font.FontWeight

import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import androidx.lifecycle.viewmodel.compose.viewModel

import com.sentinel.app.ui.theme.*
import com.sentinel.app.viewmodel.MainViewModel

@Composable
fun EmergencyContactsScreen(

    viewModel: MainViewModel = viewModel()
) {

    var name by remember {

        mutableStateOf("")
    }

    var phone by remember {

        mutableStateOf("")
    }

    val contacts =
        viewModel.emergencyContacts

    Box(

        modifier = Modifier
            .fillMaxSize()
            .background(

                Brush.verticalGradient(

                    listOf(

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
                .padding(24.dp)
        ) {

            Spacer(
                modifier =
                    Modifier.height(30.dp)
            )

            Text(

                text =
                    "EMERGENCY CONTACTS",

                color =
                    NeonBlue,

                fontSize = 30.sp,

                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(30.dp)
            )

            OutlinedTextField(

                value = name,

                onValueChange = {

                    name = it
                },

                label = {

                    Text("Guardian Name")
                },

                modifier =
                    Modifier.fillMaxWidth(),

                shape =
                    RoundedCornerShape(20.dp)
            )

            Spacer(
                modifier =
                    Modifier.height(20.dp)
            )

            OutlinedTextField(

                value = phone,

                onValueChange = {

                    phone = it
                },

                label = {

                    Text("Phone Number")
                },

                modifier =
                    Modifier.fillMaxWidth(),

                shape =
                    RoundedCornerShape(20.dp)
            )

            Spacer(
                modifier =
                    Modifier.height(24.dp)
            )

            Button(

                onClick = {

                    if (

                        name.isNotBlank()
                        &&
                        phone.isNotBlank()
                    ) {

                        viewModel
                            .addEmergencyContact(

                                name,
                                phone
                            )

                        name = ""
                        phone = ""
                    }
                },

                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(56.dp),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    ButtonDefaults.buttonColors(

                        containerColor =
                            NeonBlue
                    )
            ) {

                Text(
                    text = "SAVE CONTACT"
                )
            }

            Spacer(
                modifier =
                    Modifier.height(30.dp)
            )

            LazyColumn {

                items(contacts) { contact ->

                    Card(

                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp),

                        shape =
                            RoundedCornerShape(22.dp),

                        colors =
                            CardDefaults.cardColors(

                                containerColor =
                                    CardDark
                            )
                    ) {

                        Row(

                            modifier =
                                Modifier
                                    .fillMaxWidth()
                                    .padding(20.dp),

                            horizontalArrangement =
                                Arrangement.SpaceBetween,

                            verticalAlignment =
                                Alignment.CenterVertically
                        ) {

                            Column {

                                Text(

                                    text =
                                        contact.name,

                                    color =
                                        TextWhite,

                                    fontSize = 22.sp,

                                    fontWeight =
                                        FontWeight.Bold
                                )

                                Spacer(
                                    modifier =
                                        Modifier.height(8.dp)
                                )

                                Text(

                                    text =
                                        contact.phone,

                                    color =
                                        TextGray
                                )
                            }

                            Button(

                                onClick = {

                                    viewModel
                                        .removeEmergencyContact(

                                            contact.phone
                                        )
                                },

                                colors =
                                    ButtonDefaults.buttonColors(

                                        containerColor =
                                            EmergencyRed
                                    )
                            ) {

                                Text("Delete")
                            }
                        }
                    }    }
                    }
                }
            }
        }
