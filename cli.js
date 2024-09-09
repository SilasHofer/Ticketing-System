/*
auther:Silas Hofer
 */
"use strict";

const readline = require("readline-promise").default;
const helpers = require("./src/helpers.js");

require("console.table");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    rl.setPrompt("Enter input: ");
    rl.prompt();
    rl.on("close", helpers.exitProgram);
    rl.on("line", async function (input) {
        let res;

        input = input.trim();
        let parts = input.split(" ");

        switch (parts[0]) {
            case "menu":
            case "help":
                helpers.showMenu();
                break;
            case "exit":
            case "quit":
                helpers.exitProgram(0);
                break;
            case "about":
                console.log("Programmer: Silas Hofer");
                break;
            case "log":
                if (parts.length < 3 || parts[2] == "activaty") {
                    res = await helpers.showActivatyLog(parts[1]);
                } else {
                    res = "Ther is no " + parts[2] + " log tabel";
                }
                console.table(res);
                break;
            case "product":
                res = await helpers.showProducts();
                console.table(res);
                break;
            case "shelf":
                res = await helpers.showWarehouse();
                console.table(res);
                break;
            case "inv":
                if (parts.length < 2) {
                    res = await helpers.showInventory("");
                } else {
                    var filter = parts.slice(1).join(' ');

                    res = await helpers.showInventory(filter);
                }
                console.table(res);
                break;
            case "invadd":
                if (parts.length == 4) {
                    res = await helpers.addToInventory(parts[1], parts[2], parts[3]);
                } else if (parts.length < 4) {
                    res = "Too little arguments!";
                } else {
                    res = "Too many arguments!";
                }
                console.log(res);
                break;
            case "invdel":
                if (parts.length == 4) {
                    res = await helpers.deleteFromInventory(parts[1], parts[2], parts[3]);
                } else if (parts.length < 4) {
                    res = "Too little arguments!";
                } else {
                    res = "Too many arguments!";
                }
                console.log(res);
                break;
            case "order":
                if (parts.length == 1) {
                    res = await helpers.showOrders("");
                } else {
                    res = await helpers.showOrders(parts[1]);
                }
                if (res == "") {
                    res = "There are no orders";
                }
                console.table(res);
                break;
            case "picklist":
                if (parts.length != 1) {
                    res = await helpers.showPicklist(parts[1]);
                } else {
                    res = "You need to shows an orderid!";
                }
                console.table(res);
                break;
            case "ship":
                if (parts.length != 1) {
                    res = await helpers.shipOrder(parts[1]);
                } else {
                    res = "You need to shows an orderid!";
                }
                console.table(res);
                break;
            case "payed":
                if (parts.length == 3) {
                    res = await helpers.payInvoice(parts[1], parts[2]);
                } else {
                    res = "You need add an invoiceid and an date";
                }
                console.table(res);
                break;
            default:
                console.log(`Can't find comment: ${input}`);
                break;
        }
        rl.prompt();
    });
}
main();
