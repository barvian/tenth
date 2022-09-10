import type { PageLoad } from './$types';
import { withLoadNoAuth } from '~/lib/auth';

export const load: PageLoad = withLoadNoAuth();
