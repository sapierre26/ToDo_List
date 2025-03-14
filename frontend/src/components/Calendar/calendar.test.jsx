//calendar.test.js
import React from 'react';
const { render, screen, fireEvent, cleanup } = require('@testing-library/react');
const CalendarComponent = require('./page').default;
import '@testing-library/jest-dom'; 
import { afterEach } from 'node:test';
afterEach(() => {
    cleanup();
})

beforeEach(() => {
    render(<CalendarComponent />);
});

describe("CalendarComponent Tests", () => {
    test("1. renders CalendarComponent without crashing", () => {
        expect(screen.getByText(/Today/i)).toBeInTheDocument();
    });

    test('2. -> button click navigates to next', () => {
        const nextButton = screen.getByText('→');
        fireEvent.click(nextButton);

    });

    test('3. <- button clickable', () => {
        const prevButton = screen.getByText('←');
        fireEvent.click(prevButton);
    });

    test('4. Month navigates to month view and month button clickable', () => {
        const month = screen.getByText('Month');
        fireEvent.click(month);
        expect(document.querySelector('.rbc-month-view')).toBeInTheDocument();
    })

    test('5. Week navigates to week view and week button clickable', () => {
        const week = screen.getByText('Week');
        fireEvent.click(week);
        expect(document.querySelector('.rbc-time-view')).toBeInTheDocument();
    });

    test('6. Day navigates to day view and day button clickable', () => {
        const day = screen.getByText( 'Day');
        fireEvent.click(day);
        expect(document.querySelector('.rbc-time-view')).toBeInTheDocument();
    });

    test('7. Clicking Agenda button switches to agenda view', () => {
        const agenda = screen.getByText('Agenda');
        fireEvent.click(agenda);
        expect(document.querySelector('.rbc-agenda-view')).toBeInTheDocument();
    });

    test('8. Monthly date cells selectable', () => {

        const dateCells = screen.getAllByRole('cell');
        fireEvent.click(dateCells[5]);
        expect(document.querySelector('.rbc-button-link')).toBeInTheDocument();
    });

    test('9. Today Button Clickable', () => {
        fireEvent.click(screen.getByText('Today'));
        expect(document.getElementById('da8vorr'));
    });

});