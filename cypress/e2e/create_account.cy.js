describe('Account Creation Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/createAccount');
  });

  it('should display validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field is required').should('have.length', 1);
  });

  it('should display password length error', () => {
    cy.get('input[name="password"]').type('short');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Password must be at least 8 characters.').should('exist');
  });

  it('should display email format error', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Please enter a valid email address.').should('exist');
  });

  it('should successfully create an account through UI', () => {
    const testUsername = `testuser_${Math.floor(Math.random() * 10000)}`;
    
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="email"]').type(`${testUsername}@example.com`);
    cy.get('input[name="password"]').type('ValidPassword123!');
    
    cy.get('button[type="submit"]').click();
    cy.contains('Account created successfully!').should('exist');
  });

  it('should handle registration errors through API', () => {
    // Test duplicate username
    const existingUser = {
      name: "Existing User",
      username: "existinguser",
      pwd: "password123",
      email: "existing@example.com"
    };

    // First create the user
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/auth/register',
      body: existingUser,
      failOnStatusCode: false
    });

    // Then try to create again
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/auth/register',
      body: existingUser,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.match(/already (taken|registered)/);
    });
  });

  it('should validate login through API', () => {
    const testUser = {
      name: "Test User",
      username: `testuser_${Math.floor(Math.random() * 10000)}`,
      pwd: "TestPassword123!",
      email: `test_${Math.floor(Math.random() * 10000)}@example.com`
    };

    // Register first
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/auth/register',
      body: testUser
    }).then((registerResponse) => {
      expect(registerResponse.status).to.eq(201);
      
      // Then test login
      cy.request({
        method: 'POST',
        url: 'http://localhost:8000/api/auth/login',
        body: {
          username: testUser.username,
          pwd: testUser.pwd
        }
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        expect(loginResponse.body).to.have.property('token');
        expect(loginResponse.body).to.have.property('success', true);
      });
    });
  });
  it('should fetch user profile through API GET request', () => {
    // First register and login to get token
    const testUser = {
      name: "Test User",
      username: `testuser_${Math.floor(Math.random() * 10000)}`,
      pwd: "TestPassword123!",
      email: `test_${Math.floor(Math.random() * 10000)}@example.com`
    };
  
    cy.request('POST', 'http://localhost:8000/api/auth/register', testUser)
      .then((registerResponse) => {
        return cy.request('POST', 'http://localhost:8000/api/auth/login', {
          username: testUser.username,
          pwd: testUser.pwd
        });
      })
      .then((loginResponse) => {
        // Now test GET endpoint with auth token
        cy.request({
          method: 'GET',
          url: `http://localhost:8000/api/auth/profile`,
          headers: {
            Authorization: `Bearer ${loginResponse.body.token}`
          }
        }).then((profileResponse) => {
          expect(profileResponse.status).to.eq(200);
          expect(profileResponse.body).to.have.property('username', testUser.username);
        });
      });
  });
});