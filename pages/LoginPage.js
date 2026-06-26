const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) { 
        this.page = page;
        // Locators
        this.usernameInput = page.locator('#email'); //found by id using css selector
        this.passwordInput = page.locator('#password'); //found by id using css selector
        this.signInbutton = page.getByRole('button', { name: 'Sign In' }); //found by role and name using aria selector 
    }

    async goTo(baseUrl){
        await this.page.goto(`${baseUrl}/login`); 
    }

    async login (email, password){
        await this.usernameInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInbutton.click();
    }

}
module.exports = { LoginPage };