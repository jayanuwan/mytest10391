import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmationPopup from '../../Components/DeleteConfirmationPopup';

describe('DeleteConfirmationPopup', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open is true', () => {
    render(
      <DeleteConfirmationPopup
        open={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this item?')
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const { queryByText } = render(
      <DeleteConfirmationPopup
        open={false}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    expect(queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(
      <DeleteConfirmationPopup
        open={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete is clicked', () => {
    render(
      <DeleteConfirmationPopup
        open={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('does not crash if onConfirm is undefined', () => {
    render(<DeleteConfirmationPopup open={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
