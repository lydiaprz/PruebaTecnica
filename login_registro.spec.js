const { test, expect } = require("@playwright/test");
const fs = require('fs');
const path = require('path');

//Datos de prueba
const url = "https://globalsqa.com/angularJs-protractor/registration-login-example/#/login";
let user = "lorenasg";
let pass = "123456";
let name = "Lorena";
let lastname = "Sanchez";

//crear carpeta de screenshots si no existe
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('Carpeta de screenshots creada');
}

//test de login y registro
test("Login y registro", async ({ page }) => {
    //navegar a la url
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_inicial.png" });

    //verificar que la url sea la correcta
    await expect(page).toHaveURL(url);

    //acceder al registro
    await page.click("//a[@href='#/register']");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_registro.png" });

    //completar el formulario
    await page.fill("//input[@name='firstName']", name);
    await page.fill("//input[@name='lastName']", lastname);
    await page.fill("//input[@name='username']", user);
    await page.fill("//input[@name='password']", pass);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_registro_formulario_completado.png" });

    //hacer click en el boton de registro
    await page.click("//div[@class='form-actions']//button[1]");
    await page.waitForTimeout(2000);

    //Verificar que se haya registrado correctamente y nos ha redirigido a la pantalla de login
    await expect(page.locator("//div[@ng-bind='flash.message']")).toBeVisible();
    await page.screenshot({ path: "./screenshots/pantalla_registro_exitoso.png" });

    //completar el formulario de login
    await page.fill("//input[@name='username']", user);
    await page.fill("//input[@name='password']", pass);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_login_completado.png" });

    //hacer click en el boton de login
    await page.click("//div[@class='form-actions']//button[1]");
    await page.waitForTimeout(2000);

    //verificar que se haya iniciado sesión correctamente
    await expect(page.locator(`//h1[contains(text(),'Hi ${name}!')]`)).toBeVisible();
    await page.screenshot({ path: "./screenshots/pantalla_login_exitoso.png" });

    //eliminar el usuario
    await page.click(`//li[contains(.,'${user}')]//a`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_eliminar_usuario.png" });

    //hacer logout
    await page.click("//a[@href='#/login']");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "./screenshots/pantalla_login_completado.png" });

    //verificar que se haya cerrado sesión correctamente
    await expect(page.url()).toBe(url);
});
