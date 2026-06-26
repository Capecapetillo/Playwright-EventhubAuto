const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) { 
        this.page = page;
        //locator for the browse events link
        this.browserEventsLink = page.getByRole('link', { name: 'Browse Events →' })
    }

    async verifyDashboardLoaded(){
        await expect(this.browserEventsLink).toBeVisible();
    }

    //New method to handle UI navigation
    async clickBrowseEvents() {
        await this.browserEventsLink.click();
    }

}
module.exports = {DashboardPage};