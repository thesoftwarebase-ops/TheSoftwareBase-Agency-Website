import { Navbar } from './navbar';
import { getSection } from '@/lib/content';

// Server wrapper: resolves the client-section flag + live brand, then
// renders the interactive navbar with dead links filtered before first paint.
export async function NavbarWrapper() {
  let showClients = true;
  let nav;
  let cta;
  let mark;
  try {
    const v = await getSection('workVisibility');
    if (v && v.data && typeof v.data.clientsEnabled === 'boolean') {
      showClients = v.data.clientsEnabled;
    }
  } catch {
    // Flag unreadable — show everything rather than hide.
  }
  try {
    const s = await getSection('site');
    if (s.data && typeof s.data === 'object') {
      if (Array.isArray(s.data.nav)) nav = s.data.nav;
      if (s.data.cta && typeof s.data.cta === 'object') cta = s.data.cta;
    }
  } catch {
    // Brand unreadable — navbar falls back to lib defaults.
  }
  try {
    const f = await getSection('footer');
    if (f.data && typeof f.data === 'object' && typeof f.data.watermark === 'string') {
      mark = f.data.watermark;
    }
  } catch {
    // Watermark unreadable — navbar falls back to lib default.
  }
  return <Navbar showClients={showClients} nav={nav} cta={cta} mark={mark} />;
}
