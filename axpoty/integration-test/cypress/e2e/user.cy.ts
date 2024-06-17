import { ROUTES } from './constant'

// Create new user, check that user has no articles, then create an article and check that it was created
describe('user', () => {
    it('should create a new user, check that user has no articles, and then create an article', () => {
        // Register new user
        cy.visit(ROUTES.REGISTER)

        cy.get('[placeholder="Your Name"]').type('foo')
        cy.get('[placeholder="Email"]').type('foo@example.com')
        cy.get('[placeholder="Password"]').type('12345678')

        cy.get('[type="submit"]').click()

        cy.url().should('match', /\/#\/$/)

        // Check that user has no articles
        cy.visit(ROUTES.HOME)
        cy.get('.home-page p')
            .should('contain', 'A place to share your knowledge.')

        // Create article
        cy.get('[href="#/article/create"]').click()
        cy.get('[placeholder="Article Title"]').type('Title')
        cy.get('[placeholder="What\'s this article about?"]').type('content')
        cy.get('[placeholder="Write your article (in markdown)"]').type('## test')
        cy.get('[placeholder="Enter tags"]').type('butt')
        cy.get('[type="submit"]').click()

        // Check that article was created
        cy.url()
            .should('contain', 'article/title')
        cy.get('.container > h1')
            .should('contain', 'Title')
    });
})
