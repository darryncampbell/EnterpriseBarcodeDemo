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

var scannersOnDevice;   //  JSON Array of Scanners on the device
var selectedScanner = -1;

//$('input[type="checkbox"].style1').checkbox({
//                                    buttonStyle: 'btn-base',
//                                    buttonStyleChecked: 'btn-success',
//                                    checkedClass: 'icon-check',
//                                    uncheckedClass: 'icon-check-empty'
//                                });

//$('input[type="checkbox"]').checkbox({
//    checkedClass: 'icon-check',
//    uncheckedClass: 'icon-check-empty'
//});

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
        enterpriseBarcode.enumerate(
            function(scanners)
            {
                scannersOnDevice = scanners;
//                alert(JSON.stringify(scannersOnDevice));
                var buttonsDiv = document.getElementById("scannerButtons");
                var buttonsDivText = "";
                for (var i=0; i<scannersOnDevice.scanners.length;i++)
                {
                    //  Add to list
                    buttonsDivText += "<button type='button' class='btn btn-info' onclick='javascript:selectedScannerChanged(" + i + ");'> " + scannersOnDevice.scanners[i].friendlyName + " </button> ";
                }
                buttonsDiv.innerHTML = buttonsDivText;
                selectedScannerChanged(0);
            },
            function(data)
            {
                alert('Failed to Enumerate Scanners');
            });
    }
};

app.initialize();

function enableBarcode()
{
    enterpriseBarcode.enable(
        function(scannedObj)
        {
            alert(scannedObj.data);
        },
        function(data)
        {
            alert('failure');
        },
        {
            'friendlyName':getSelectedScannerFriendlyName(selectedScanner)
        });
}

function disableBarcode()
{
    enterpriseBarcode.disable(
        function()
        {
            alert('disabled');
        },
        function(data)
        {
            alert('failure');
        });
}

function selectedScannerChanged(index)
{
   if (index >= 0)
   {
        var html = "Friendly Name: " + scannersOnDevice.scanners[index].friendlyName + "<br/>";
        html += "Decoder Type: " + scannersOnDevice.scanners[index].decoderType + "<br/>";
        html += "Device Type: " + scannersOnDevice.scanners[index].deviceType + "<br/>";
        html += "Model Number: " + scannersOnDevice.scanners[index].modelNumber + "<br/>";
        html += "Connected: " + scannersOnDevice.scanners[index].connected + "<br/>";
        document.getElementById("scannerInfo").innerHTML = html;
        selectedScanner = index;
   }
}

function getSelectedScannerFriendlyName(index)
{
   if (index >= 0)
    return scannersOnDevice.scanners[index].friendlyName;
   else
   {
    alert("Could not find Scanner Friendly Name");
    return -1;
    }
}