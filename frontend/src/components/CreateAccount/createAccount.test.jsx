import React from 'react';
const { render, screen, fireEvent, cleanup } = require('@testing-library/react');
const CreateAccount = require('./page').default;
import '@testing-library/jest-dom'; 
import { describe } from 'node:test';

beforeEach(() => {
    render(<CreateAccount />);
});

describe('createAccount Component Test', () => {
    test('1. Create an account button should be present', () => {
        const createAnAccountButton = screen.getByRole('button', { name: /Create an account/i });
        expect(createAnAccountButton).toBeInTheDocument();
    });

    test('2. Error message for empty credentials', () => {
        const createAnAccountButton = screen.getByRole('button', { name: /Create an account/i });
        fireEvent.click(createAnAccountButton);

        expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    test('3. Error message for empty credentials', () => {
        fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'testfirstName' } });
        fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'testlastName' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testusername' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testemail@sdd' } });

        const createAnAccountButton = screen.getByRole('button', { name: /Create an account/i });

        fireEvent.click(createAnAccountButton);

        expect(screen.queryByText('All fields are required.')).not.toBeInTheDocument();
        expect(screen.queryByText('Please enter your first name')).not.toBeInTheDocument();
        expect(screen.queryByText('Please enter a password')).not.toBeInTheDocument();
    });
    test('3. Error message for empty credentials', () => {
        fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'testfirstName' } });
        fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'testlastName' } });

        const createAnAccountButton = screen.getByRole('button', { name: /Create an account/i });

        fireEvent.click(createAnAccountButton);

        expect(screen.queryByText('All fields are required.')).toBeInTheDocument();
    });

})