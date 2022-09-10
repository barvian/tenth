import { withLoadAuth } from '~/lib/auth';
import type { PageLoad } from './$types';

export const load = withLoadAuth<PageLoad>(); // could this go in the layout?
