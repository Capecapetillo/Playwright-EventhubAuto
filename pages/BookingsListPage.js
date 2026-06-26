const { expect } = require('@playwright/test');

class BookingsListPage {
     constructor(page) {
        this.page = page;
        // Best practice: target the link with specific accessible text
        this.firstViewDetailsLin = page.getByRole('button', { name: 'View Details' }).first();//locator by role
        
     }

     async verifyOnBookingsPage(){
        //confirm we successfully arrived here 
        await expect(this.page).toHaveURL(/.*\/bookings/);
     }

     async clickFirstViewDetails(){
        await  this.firstViewDetailsLin.click();
     }



}
module.exports = { BookingsListPage };
 