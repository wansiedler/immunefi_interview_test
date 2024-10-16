import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';
import chai from 'chai';
import chaiDom from 'chai-dom';

chai.use(chaiDom);
describe('Dashboard Component', () => {
    it('should render the Dashboard component', () => {
        render(<Dashboard />);
        const dashboardElement = screen.getByTestId('dashboard'); // Ensure you have a data-testid="dashboard" in the main element
        expect(dashboardElement).to.be.ok;
    });

    it('should display filters like Report ID, Project, and Hacker', () => {
        render(<Dashboard />);
        expect(screen.getByLabelText(/Report ID/i)).to.exist;
        expect(screen.getByLabelText(/Project/i)).to.exist;
        expect(screen.getByLabelText(/Hacker/i)).to.exist;
    });

    it('should allow changing tabs', () => {
        render(<Dashboard />);
        const tab = screen.getByText(/Reported/i);
        fireEvent.click(tab);
        expect(tab).to.have.attribute('class').that.contains('Mui-selected');
    });

    it('should update filters when input changes', () => {
        render(<Dashboard />);
        const reportIdInput = screen.getByLabelText(/Report ID/i);
        fireEvent.change(reportIdInput, { target: { value: '123' } });
        expect(reportIdInput).to.have.value('123');

        const projectInput = screen.getByLabelText(/Project/i);
        fireEvent.change(projectInput, { target: { value: 'Test Project' } });
        expect(projectInput).to.have.value('Test Project');
    });

    it('should handle filter selection like severity and report type', () => {
        render(<Dashboard />);
        const severitySelect = screen.getByLabelText(/Severity/i);
        fireEvent.change(severitySelect, { target: { value: 'high' } });
        expect(severitySelect).to.have.value('high');

        const reportTypeSelect = screen.getByLabelText(/Report Type/i);
        fireEvent.change(reportTypeSelect, { target: { value: 'smart_contract' } });
        expect(reportTypeSelect).to.have.value('smart_contract');
    });
});
