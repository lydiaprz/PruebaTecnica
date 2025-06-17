const { test, expect } = require("@playwright/test");
const path = require('path');
const fs = require('fs');

// Función para generar el nombre del archivo
function getScreenshotPath(stepName) {
    const folderPath = './screenshots';
    
    // Crear la carpeta si no existe
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    return path.join(folderPath, `${stepName}.png`);
}

//Datos de prueba
const url = "https://globalsqa.com/angularJs-protractor/registration-login-example/#/login";
let user = "lorenasg";
let pass = "123456";
let name = "Lorena";
let lastname = "Sanchez";

// Método para realizar el registro
async function realizarRegistro(page) {
    await page.click("//a[@href='#/register']");
    await page.fill("//input[@id='firstName']", name);
    await page.fill("//input[@name='lastName']", lastname);
    await page.fill("//input[@ng-model='vm.user.username']", user);
    await page.fill("//input[@id='password']", pass);
    await page.screenshot({ path: getScreenshotPath('datos_registro_completados') });
    await page.click("//div[@class='form-actions']//button[1]");
    await page.waitForTimeout(2000);
}

// Método para realizar el login
async function realizarLogin(page) {
    await page.fill("//input[@ng-model='vm.username']", user);
    await page.fill("//input[@ng-model='vm.password']", pass);
    await page.screenshot({ path: getScreenshotPath('datos_login_completados') });
    await page.click("//div[@class='form-actions']//button[1]");
    await page.waitForTimeout(2000);
}

//Test 1: Registro exitoso
test("Registro exitoso", async ({ page }) => {
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: getScreenshotPath('pagina_inicial') });
    
    await realizarRegistro(page);

    await expect(page.locator("//div[contains(@class,'ng-binding ng-scope')]")).toBeEnabled();
    await page.screenshot({ path: getScreenshotPath('registro_completado') });
});

//Test 2: Login exitoso
test("Login exitoso", async ({ page }) => {
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: getScreenshotPath('pagina_login') });
    
    // Registro
    await realizarRegistro(page);
    
    // Login
    await realizarLogin(page);
    
    await expect(page.locator(`//li[contains(text(),'${user}')]`)).toBeVisible();
    await expect(page.locator(`//li[contains(text(),'${name} ${lastname}')]`)).toBeVisible();
    await page.screenshot({ path: getScreenshotPath('login_exitoso') });
});

//Test 3: Elimina el usuario
test("Elimina el usuario", async ({ page }) => {
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: getScreenshotPath('inicio_eliminacion') });
    
    // Registro
    await realizarRegistro(page);
    
    // Login
    await realizarLogin(page);
    await expect(page.locator("//h1[contains(text(),'Hi')]")).toBeVisible();
    
    // Eliminar
    await page.click("//a[normalize-space(text())='Delete']");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: getScreenshotPath('usuario_eliminado') });
    
    // Verificar que el usuario fue eliminado
    await expect(page.locator(`//li[contains(text(),'${user}')]`)).not.toBeVisible();
    await expect(page.locator(`//li[contains(text(),'${name} ${lastname}')]`)).not.toBeVisible();
    await page.click("//a[normalize-space(text())='Logout']");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: getScreenshotPath('logout_exitoso') });
});