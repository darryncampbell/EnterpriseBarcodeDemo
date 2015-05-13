/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var scannersOnDevice;   //  JSON Array of Scanners on the device, populated on startup during enumerate()
var selectedScanner = -1;

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    //  Two ways to Enumerate the Scanners on the device
    //  The enumerated scanners are saved in the scannersOnDevice property.
    //  1: scanners. property:
    //populateScannersArray(enterpriseBarcode.scanners);
    //  2: Using enumerate method
    enterpriseBarcode.enumerate(
        function(scannersObj)
        {
            populateScannersArray(scannersObj.scanners);
        },
        function(data)
        {
            displayScannerStatus("Failed to Enumerate Scanners");
        });
    }
};

app.initialize();

//  Helper functions
function enableBarcode()
{
    //  Enable the scanner selected by the user
    enterpriseBarcode.enable(
        function(scannedObj)
        {
            if (scannedObj.status == "enabled")
            {
                displayScannerStatus("Scanner is Enabled");
                disableCheckboxes(false);
                getProperties();
            }
            else
                displayScannerStatus("Scanned barcode: " + scannedObj.data + " [" + scannedObj.type + "]. (" + scannedObj.timestamp + ")");

        },
        function(data)
        {
            displayScannerStatus("Failure: " + data.message);
        },
        {
            'friendlyName':getSelectedScannerFriendlyName(selectedScanner)
        });
}

function disableBarcode()
{
    //  Call disable on the scanner and disable associated UI
    enterpriseBarcode.disable(
        function()
        {
            displayScannerStatus("Scanner is Disabled");
            disableCheckboxes(true);
        },
        function(data)
        {
            displayScannerStatus("Failure: " + data.message);
        });
}

function getProperties()
{
    //  Retrieve properties supported by the scanner, will be called after the scanner is
    //  enabled to notify which decoders are currently on / off
    enterpriseBarcode.getProperties(
        function (scannerProps)
        {
            $("input[type='checkbox']").attr("checked",true).checkboxradio("refresh");
            document.getElementById("checkbox-1").checked = scannerProps.code11Enabled;
            document.getElementById("checkbox-2").checked = scannerProps.code128Enabled;
            document.getElementById("checkbox-3").checked = scannerProps.code39Enabled;
            document.getElementById("checkbox-4").checked = scannerProps.code93Enabled;
            document.getElementById("checkbox-5").checked = scannerProps.dataMatrixEnabled;
            document.getElementById("checkbox-6").checked = scannerProps.ean8Enabled;
            document.getElementById("checkbox-7").checked = scannerProps.ean13Enabled;
            document.getElementById("checkbox-8").checked = scannerProps.upcaEnabled;
            document.getElementById("checkbox-9").checked = scannerProps.upce1Enabled;
            document.getElementById("checkbox-10").checked = scannerProps.pdf417Enabled;
            $("input[type='checkbox']").attr("checked",true).checkboxradio("refresh");
        },
        function(data)
        {
            displayScannerStatus("Failure: " + data.message);
        });
}

//  Helper function to enable or disable the decoder checkboxes (since you can't change these when
//  the scanner is disabled)
function disableCheckboxes(disableCheck)
{
    document.getElementById("checkbox-1").disabled = disableCheck;
    document.getElementById("checkbox-2").disabled = disableCheck;
    document.getElementById("checkbox-3").disabled = disableCheck;
    document.getElementById("checkbox-4").disabled = disableCheck;
    document.getElementById("checkbox-5").disabled = disableCheck;
    document.getElementById("checkbox-6").disabled = disableCheck;
    document.getElementById("checkbox-7").disabled = disableCheck;
    document.getElementById("checkbox-8").disabled = disableCheck;
    document.getElementById("checkbox-9").disabled = disableCheck;
    document.getElementById("checkbox-10").disabled = disableCheck;
    $("input[type='checkbox']").attr("checked",true).checkboxradio("refresh");
}

//  Respond to user selecting which scanner they are interested in, display scanner properties.
function selectedScannerChanged(index)
{
   if (index >= 0)
   {
        var html = "Friendly Name: " + scannersOnDevice[index].friendlyName + "<br/>";
        html += "Decoder Type: " + scannersOnDevice[index].decoderType + "<br/>";
        html += "Device Type: " + scannersOnDevice[index].deviceType + "<br/>";
        html += "Model Number: " + scannersOnDevice[index].modelNumber + "<br/>";
        html += "Connected: " + scannersOnDevice[index].connected + "<br/>";
        document.getElementById("scannerInfo").innerHTML = html;
        selectedScanner = index;
        document.getElementById("scannerStatus").innerText = "";
   }
}

//  Helper function to ensure we call enable with the correct scanner, as requested by the user.
function getSelectedScannerFriendlyName(index)
{
   if (index >= 0)
    return scannersOnDevice[index].friendlyName;
   else
   {
    alert("Could not find Scanner Friendly Name");
    return -1;
    }
}

function displayScannerStatus(statusMsg)
{
    document.getElementById("scannerStatus").innerText = statusMsg;
}

//  Respond to a checkbox being selected or deselected.
function symbologyChanged(symbology, checkbox)
{
    var checked = document.getElementById(checkbox).checked;
    var jsonObj = JSON.parse('{"' + symbology + '":' + checked + '}');
    enterpriseBarcode.setProperties(
            function(status)
            {
                displayScannerStatus("Properties Set: " + status.message);
            },
            function(status)
            {
                displayScannerStatus("Failed to set Properties: " + status.message);
            },
                jsonObj
            );
}

//  Create the UI for the buttons to represent each scanner on the device
function populateScannersArray(scannersArray)
{
    //  Displays a button to represent each scanner we have on the device
    scannersOnDevice = scannersArray;
    var buttonsDiv = document.getElementById("scannerButtons");
    var buttonsDivText = "";
    for (var i=0; i<scannersOnDevice.length;i++)
    {
        //  Add to list
        buttonsDivText += "<button type='button' class='btn btn-info' onclick='javascript:selectedScannerChanged(" + i + ");'> " + scannersOnDevice[i].friendlyName + " </button> ";
    }
    buttonsDiv.innerHTML = buttonsDivText;
    selectedScannerChanged(0);
    disableCheckboxes(true);
}