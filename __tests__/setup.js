import '@testing-library/jest-dom/extend-expect';

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
});

jest.mock('next/router', () => ({
    userRouter: jest.fn()
}));

jest.mock('@auth0/nextjs-auth0', () => {
    return {
        getAccessToken: () => 'access_token',
        withApiAuthRequired: handler => handler,
        withPageAuthRequired: page => () => page()
    };
});