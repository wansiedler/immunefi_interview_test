import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {expect} from 'chai';
import '@testing-library/jest-dom';
import {Filters} from "@/components/Filters/Filters";
import {ReportFilters} from "@/pages/api/reports";

describe('Filters Component', () => {
    const mockFilters: ReportFilters = {
        reportId: undefined,
        project: '',
        hacker: '',
        severity: "critical",
        type: "blockchain_dlt",
        status: "closed"
    };

    const mockSetFilters = () => {
    };
    const mockHandleFilterChange = () => {
    };

    it('renders filter inputs', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        expect(screen.getByLabelText(/Report ID/i)).to.exist;
        expect(screen.getByLabelText(/Project/i)).to.exist;
        expect(screen.getByLabelText(/Hacker/i)).to.exist;
        expect(screen.getByLabelText(/Severity/i)).to.exist;
        expect(screen.getByLabelText(/Report Type/i)).to.exist;
    });

    it('allows updating Report ID filter', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        const reportIdInput = screen.getByLabelText(/Report ID/i) as HTMLInputElement;
        fireEvent.change(reportIdInput, {target: {value: '123'}});
        expect(reportIdInput.value).to.equal('123');
    });

    it('allows updating Project filter', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        const projectInput = screen.getByLabelText(/Project/i) as HTMLInputElement;
        fireEvent.change(projectInput, {target: {value: 'Test Project'}});
        expect(projectInput.value).to.equal('Test Project');
    });

    it('allows updating Hacker filter', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        const hackerInput = screen.getByLabelText(/Hacker/i) as HTMLInputElement;
        fireEvent.change(hackerInput, {target: {value: 'test@example.com'}});
        expect(hackerInput.value).to.equal('test@example.com');
    });

    it('allows selecting Severity filter', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        const severitySelect = screen.getByLabelText(/Severity/i) as HTMLSelectElement;
        fireEvent.change(severitySelect, {target: {value: 'high'}});
        expect(severitySelect.value).to.equal('high');
    });

    it('allows selecting Report Type filter', () => {
        render(
            <Filters
                filters={mockFilters}
                setFilters={mockSetFilters}
                handleFilterChange={mockHandleFilterChange}
            />
        );
        const reportTypeSelect = screen.getByLabelText(/Report Type/i) as HTMLSelectElement;
        fireEvent.change(reportTypeSelect, { target: { value: 'smart_contract' } });
        expect(reportTypeSelect.value).to.equal('smart_contract');
    });
});