import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/LoginScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,  // ✅ Ensure replace is mocked correctly
    goBack: jest.fn(),
  }),
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const renderWithNavigation = (ui) => {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
};

describe('LoginScreen', () => {
  it('renders the login screen with inputs and button', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(<LoginScreen />);
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows an error if email or password is empty', async () => {
    const { getByText, getByPlaceholderText } = renderWithNavigation(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), '');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Email and password are required.')).toBeTruthy();
    });
  });

  it('shows an error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = renderWithNavigation(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Invalid email address format.')).toBeTruthy();
    });
  });

  it('navigates to Home on successful login', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ token: 'mock-token' }),
      status: 200,
    });

    const { getByText, getByPlaceholderText } = renderWithNavigation(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('Home');  // ✅ Use mockReplace, not mockNavigate
    });
  });

  it('displays an error message when login fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));

    const { getByText, getByPlaceholderText } = renderWithNavigation(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('An unknown error occurred. Please try again.')).toBeTruthy();
    });
  });
});
