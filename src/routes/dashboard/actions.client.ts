import { error } from '@sveltejs/kit'
import { getValues, success, type ClientAction } from '~/lib/actions'

export const update_percentage: ClientAction = async ({
	data,
	session,
	supabaseClient
}) => {
	if (!session) throw error(403, 'No user logged in')

	const { error: updateError } = await supabaseClient
		.from('profiles')
		.update({
			percentage: +(data.get('percentage') as string)
		})
		.eq('user_id', session.user.id)
	if (updateError) throw updateError

	return success(data)
}

export const update_split: ClientAction = async ({
	data,
	session,
	supabaseClient
}) => {
	if (!session) throw error(403, 'No user logged in')

	// omit the internal fields and convert the form data to an object
	const split = getValues(data)
	const length = Object.keys(split).length

	console.log(split)
	const { error: updateError } = await supabaseClient.from('designated').upsert(
		Object.keys(split).map((change_id) => ({
			user_id: session.user.id,
			change_id,
			weight: (+split[change_id] / 100) * length
		}))
	)
	if (updateError) throw updateError

	return success(data)
}
