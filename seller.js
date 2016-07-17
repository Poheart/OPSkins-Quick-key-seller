var keyindexMin = 0;
var keyindexMax = 20;
var seller = {
    checkSaleForm: function() {
        return ($("#shopSellItemForm").length == 1 && $(".queueContainer").length == 1);
    },

    sellAllBtn: function() {
        // save all current settings
        var shopSellAmt = parseFloat($("#shopSellAmt").val());

        if (isNaN(shopSellAmt) || shopSellAmt <= 0.0) {
            showAlert('<div class="alert alert-danger"><strong>OPSkins Quick Key Seller:</strong> <br>Please input the sale price for your item first!</div>');
            return;
        }
        var lastvalue = $("#shopSellAmt").val();
        chrome.storage.local.set({
            'keyvalue': lastvalue
        }, function() {
            // Notify that we saved.
            console.log("Setting saved!(" + lastvalue + ")");
        });
        var keyType_radio = $("input[name='keyType']:checked").val();
        var items = "";
        switch (keyType_radio) {
            case "gamma":
                items = $(".pg-item[data-name=\"Gamma Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "chroma3":
                items = $(".pg-item[data-name=\"Chroma 3 Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "chroma2":
                items = $(".pg-item[data-name=\"Chroma 2 Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "chroma":
                items = $(".pg-item[data-name=\"Chroma Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "wildfire":
                items = $(".pg-item[data-name=\"Operation Wildfire Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "casekey":
                items = $(".pg-item[data-name=\"CS:GO Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "falchion":
                items = $(".pg-item[data-name=\"Falchion Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "revolver":
                items = $(".pg-item[data-name=\"Revolver Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "shadow":
                items = $(".pg-item[data-name=\"Shadow Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "huntsman":
                items = $(".pg-item[data-name=\"Huntsman Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "breakout":
                items = $(".pg-item[data-name=\"Operation Breakout Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "phoenix":
                items = $(".pg-item[data-name=\"Operation Phoenix Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "vanguard":
                items = $(".pg-item[data-name=\"Operation Vanguard Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "winter":
                items = $(".pg-item[data-name=\"Winter Offensive Case Key\"]").slice(keyindexMin, keyindexMax);
                break;
            case "esports":
                items = $(".pg-item[data-name=\"eSports Key\"]").slice(keyindexMin, keyindexMax);
                break;
            default:
                items = $(".pg-item[data-type=\"Base Grade Key\"]").slice(keyindexMin, keyindexMax);

        }
        var price;
        items.each(function() {
            var uItem = $(this).attr("id").substring(8);
            $("#uItem").val(uItem);
            $("#shopSellAmt").val(shopSellAmt);
            price = $("#shopSellAmt").val();
            $("#sellBtn").click();

        });


        $("#QKSHints").css("display", "");
        if (items.length <= 0) {
            showAlert('<div class="alert alert-danger"><strong>OPSkins Quick Key Seller:</strong> <br>No items were added! <strong>Possible reason:</strong><br> You do not have selected tradable key(s) in your inventory.<br> Key index is too high, try adjust to lower value.</div>');
        } else {
            showAlert('<div class="alert alert-success"><strong>OPSkins Quick Key Seller:</strong> <br>Successfully added ' + items.length + ' key(s) into queue, creating desposit request with selling price $' + price + ' ...</div>');
            setTimeout(function() {
                $("#depositBtn").click();
            }, 100);
            setTimeout(function() {
                chrome.storage.local.get('keyvalue', function(items) {
                    //enforce sale price value after clicking the deposit btn
                    $("#shopSellAmt").val(items.keyvalue);
                });
            }, 500);
        }



    },

    keyCheck: function() {

        var items = $(".pg-item[data-type=\"Base Grade Key\"]");

        items.each(function() {
            var uItem = $(this).attr("id").substring(8);
        });
        $("#keyOwned").html('Total tradable key(s): ' + items.length + '<br><span title="Item partition to be used for selecting the keys. Useful to prevent selecting invalid items while the inventory is not refreshed."><span class="glyphicon glyphicon-question-sign"></span></span> Key index: <span id="txtindexMin">0</span>~<span id="txtindexMax">20</span><Br>');
        $("#keyOwned").append($("<span>").addClass("btn").addClass("btn-sm").addClass("btn-danger").attr("id", "btnindexAdd").html('<span class="glyphicon glyphicon-minus"></span> Last 20 items').click(seller.indexSub));
        $("#keyOwned").append($("<span>").addClass("btn").addClass("btn-sm").addClass("btn-warning").attr("id", "btnindexAdd").html('<span class="glyphicon glyphicon-plus"></span> Next 20 items').click(seller.indexAdd));
    },

    indexAdd: function() {
    	if (keyindexMax >= 1000) {
            return;
        }
        keyindexMin += 20;
        keyindexMax += 20;
        seller.updateIndex();
    },

    indexSub: function() {
        if (keyindexMax <= 20) {
            return;
        }
        keyindexMin -= 20;
        keyindexMax -= 20;
        seller.updateIndex();
    },

    updateIndex: function() {
        $('#txtindexMin').text(keyindexMin);
        $('#txtindexMax').text(keyindexMax);
    }

};

function showAlert(text) {
    var $alert = $('#alert-box');
    if ($alert.is(':visible')) {
        closeAlert(100, function() {
            showAlert(text);
        });
        return;
    }
    $alert.html(text);
    $alert.slideDown();
}

function closeAlert() {
    var $alertBox = $('#alert-box');
    $alertBox.slideUp.apply($alertBox, arguments);
}

$(document).ready(function() {
    if (!seller.checkSaleForm()) {
        return;
    }
    // inject element below place item in queue button
    var btn = $("<span>").addClass("btn").addClass("btn-success")
        .attr("id", "sellAllBtn")
        .text("Place Max Keys & Deposit")
        .click(seller.sellAllBtn);
    chrome.storage.local.get('keyvalue', function(items) {
        $("#shopSellAmt").val(items.keyvalue);
        console.log("Last stored value is " + items.keyvalue);
    });

    $("#sellBtn").after(btn);
    $("#sellAllBtn").after($("<div>")
        .css({
            "border": "1px solid #333",
            "border-radius": "2px",
            "overflow": "hidden",
            "padding": "5px",
            "margin-top": "1em",
            "color": "white",
            "background": "rgba(76, 76, 73,0.3)"
        })
        .attr("id", "keyOwned")
        .html("Loading inventory..."));
    $("#keyOwned").after($("<div>").css({
            "border": "1px solid #333",
            "border-radius": "2px",
            "overflow": "hidden",
            "padding": "5px",
            "margin-top": "1em",
            "color": "white",
            "background": "rgba(76, 76, 73,0.3)"
        })
        .attr("id", "keySelector").html('Select the key you wanted:<br></strong><form id="keyForm"><label><input type="radio" name="keyType" value="gamma"> Gamma Case Key</label><br><label><input type="radio" name="keyType" value="chroma3"> Chroma 3 Case Key</label><br><label><input type="radio" name="keyType" value="chroma2"> Chroma 2 Case Key</label><br><label><input type="radio" name="keyType" value="chroma"> Chroma Case Key</label><br><label><input type="radio" name="keyType" value="wildfire"> Operation Wildfire Case Key</label><br><label><input type="radio" name="keyType" value="casekey"> CS:GO Case Key</label><br><label><input type="radio" name="keyType" value="falchion"> Falchion Case Key</label><br><label><input type="radio" name="keyType" value="revolver"> Revolver Case Key</label><br><label><input type="radio" name="keyType" value="shadow"> Shadow Case Key</label><br><label><input type="radio" name="keyType" value="huntsman"> Huntsman Case Key</label><br><label><input type="radio" name="keyType" value="breakout"> Operation Breakout Case Key</label><br><label><input type="radio" name="keyType" value="phoenix"> Operation Phoenix Case Key</label><br><label><input type="radio" name="keyType" value="vanguard"> Operation Vanguard Case Key</label><br><label><input type="radio" name="keyType" value="winter"> Winter Offensive Case Key</label><br><label><input type="radio" name="keyType" value="esports"> eSports Key</label><br><label><input type="radio" name="keyType" value="any" checked> Any case key</label></form>'));
    $("#pOff").change(function() {
        var shopSellAmt = parseFloat($("#shopSellAmt").val());

        if (isNaN(shopSellAmt)) {
            shopSellAmt = 0.0;
        } else {
            shopSellAmt *= (1 - (parseFloat($(this).val()) / 100.0));
        }

        $("#shopSellAmt").val(shopSellAmt.toFixed(2));
        updateCom();
    });
    $("#depositBtn").after($("<div>").addClass("alert").addClass("alert-info").attr("id","QKSHints").css({"margin-top":"10px", "display":"none"}).html("<strong>OPSkins Quick Key Seller</strong><br><i class=\"glyphicon glyphicon-info-sign\"></i> You can now click on 'Next 20 items' to deposit without refreshing the page."));

    setTimeout(function() {
        seller.keyCheck();
    }, 3000);
});