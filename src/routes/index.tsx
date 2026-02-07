import { createFileRoute } from '@tanstack/react-router';
import Header from 'components/Header';
import Map from 'components/Map';

function Index() {
  return (
    <>
      <Header />
      <Map />
    </>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
