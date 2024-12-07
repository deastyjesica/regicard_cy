Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false untuk mencegah Cypress mengganggu jalannya tes
    return false;
});

describe('E2E UPBOND Mimaru Regicard STG', function () {
    this.timeout(200000); // Set timeout untuk seluruh suite

    before(() => {
        // Muat credentials untuk digunakan di semua tes
        cy.fixture('credentials.json').then((credentials) => {
            Cypress.env('credentials', credentials);
        });
    });

    beforeEach(() => {
        // Gunakan sesi untuk menghindari login berulang
        cy.session('loginAsLineUser', () => {
            cy.visit('http://mimaru-regicard.stg.upbond.io/');
            cy.contains('LINE Login').click();

            cy.origin(
                'https://access.line.me',
                { args: Cypress.env('credentials') },
                ({ USRLINE, PWDLINE }) => {
                    cy.get('input[placeholder="Email address"]').type(USRLINE);
                    cy.get('input[name="tpasswd"]').type(PWDLINE);
                    cy.contains('Log in').click();
                }
            );

            cy.url({ timeout: 20000 }).should('include', 'mimaru-regicard');
        });
    });

    it('01. Login Existing User LINE', function () {
        cy.visit('http://mimaru-regicard.stg.upbond.io/');
        cy.get('body').should('be.visible');
        cy.contains('line deastyj', { timeout: 20000 }).should('be.visible');
    });

    it('02. User Add Companion', function () {
        cy.visit('http://mimaru-regicard.stg.upbond.io/');

        // click add companion
        cy.get('.z-0', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', '同行者を追加する')
            .click({ force: true });
        
        cy.get('.flex-row > .z-0').click(); // click button popup
        cy.get('.bg-secondary').contains('撮影する').click(); //click take photo
        cy.get('.bg-secondary').contains('確定する').click(); // click confirm photo

        //step 2/3
        cy.get('.gap-3 > :nth-child(2)').contains('本人情報の入力').should('be.visible'); //tangkap judul 2/3
        cy.get('input[aria-label="姓名"]').type('Deastyj FriendOne'); // input name companion
        cy.get('button.bg-secondary[type="submit"]').click();  // click submit

        //step 3/3
        cy.get('.gap-3 > :nth-child(2)').contains('入力内容の確認').should('be.visible'); //tangkap judul 3/3
        //cy.get('.bg-secondary').click();
        cy.get('button.bg-secondary').contains('登録する').click();  // click button

        cy.wait(20000); 
        cy.get('button.bg-secondary').contains('パスポート登録HOMEへ').should('be.visible').click(); // click back to home popup
        cy.get('p.text-lg').should('contain.text', 'friend deastyj'); 
        cy.get('.text-lg').should('contain.text', 'FriendOne Deastyj');

    });

    it('03. User Click Delete Companion', function () {
        cy.visit('http://mimaru-regicard.stg.upbond.io/');

        cy.wait(20000); 
        cy.get('.text-lg').should('contain.text', 'FriendOne Deastyj');
        cy.get('div.flex.text-sm.justify-end.gap-2 > button.underline').eq(2).should('be.visible').click(); // click delete 
        cy.get('button.bg-danger').contains('削除する').click(); // popup click delete
    });

    it.skip('04. User Change Language', function () {
        cy.visit('http://mimaru-regicard.stg.upbond.io/');

        cy.wait(20000); 
        cy.get('#react-aria-:R4r6:').click({ force: true }); // click icon lang
        cy.get('#react-aria2891349369-\:r5q\:') // click English lang
        //cy.get('li#react-aria2817501897-:ro:').click(); // click English lang
        cy.get('h1.text-xl.font-bold.mb-5').should('contain.text', 'Passport Registration'); // tangkap English title 
    });

    it.skip('05. User Go to Kurogo Page', function () {
        cy.visit('http://mimaru-regicard.stg.upbond.io/');

        cy.wait(5000); 
        cy.get('.my-2 > .relative').click() // click kurogo home
        cy.wait(5000)

        cy.contains('保有Stable Coin').should('be.visible');
    });
    
    
});
