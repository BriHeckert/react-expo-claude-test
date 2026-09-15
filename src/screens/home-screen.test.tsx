import { HomeScreen } from '@/screens/home-screen';
import { render, screen } from '@/utils/TestUtils';

describe('HomeScreen', () => {
  it('renders the starter copy', async () => {
    await render(<HomeScreen />);

    expect(
      screen.getByText(
        'Open up src/screens/home-screen.tsx to start working on your app!',
      ),
    ).toBeOnTheScreen();
  });
});
