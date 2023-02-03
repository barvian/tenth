// Generated via inngest types

export type Demo__Event_Sent = {
	name: 'demo/event.sent'
	data: {
		message: string
	}
	ts: number
}

export type Github__Check_Suite = {
	name: 'github/check_suite'
	data: {
		check_suite: {
			conclusion: string
			before: string
			runs_rerequestable: boolean
			head_sha: string
			status: string
			pull_requests: Array<unknown>
			updated_at: string
			head_commit: {
				tree_id: string
				message: string
				timestamp: string
				author: {
					email: string
					name: string
				}
				committer: {
					email: string
					name: string
				}
				id: string
			}
			node_id: string
			url: string
			app: {
				events: Array<string>
				slug: string
				node_id: string
				owner: {
					node_id: string
					avatar_url: string
					gists_url: string
					events_url: string
					url: string
					starred_url: string
					subscriptions_url: string
					received_events_url: string
					site_admin: boolean
					id: number
					html_url: string
					followers_url: string
					organizations_url: string
					type: string
					login: string
					gravatar_id: string
					following_url: string
					repos_url: string
				}
				external_url: string
				created_at: string
				permissions: {
					deployments: string
					issues: string
					metadata: string
					repository_hooks: string
					vulnerability_alerts: string
					administration: string
					contents: string
					repository_projects: string
					checks: string
					organization_packages: string
					actions: string
					pages: string
					pull_requests: string
					security_events: string
					statuses: string
					discussions: string
					packages: string
				}
				id: number
				name: string
				description: string
				html_url: string
				updated_at: string
			}
			rerequestable: boolean
			latest_check_runs_count: number
			check_runs_url: string
			id: number
			after: string
			head_branch: string
			created_at: string
		}
		repository: {
			node_id: string
			name: string
			has_wiki: boolean
			allow_forking: boolean
			default_branch: string
			statuses_url: string
			comments_url: string
			pulls_url: string
			homepage: unknown
			issue_events_url: string
			blobs_url: string
			subscribers_url: string
			watchers: number
			collaborators_url: string
			issue_comment_url: string
			archive_url: string
			ssh_url: string
			has_issues: boolean
			full_name: string
			commits_url: string
			releases_url: string
			size: number
			has_pages: boolean
			archived: boolean
			open_issues: number
			description: unknown
			keys_url: string
			forks_count: number
			subscription_url: string
			updated_at: string
			url: string
			hooks_url: string
			notifications_url: string
			language: string
			trees_url: string
			contributors_url: string
			git_commits_url: string
			merges_url: string
			disabled: boolean
			forks_url: string
			git_refs_url: string
			compare_url: string
			labels_url: string
			git_url: string
			mirror_url: unknown
			forks: number
			owner: {
				site_admin: boolean
				gists_url: string
				starred_url: string
				organizations_url: string
				repos_url: string
				login: string
				html_url: string
				followers_url: string
				following_url: string
				type: string
				url: string
				subscriptions_url: string
				events_url: string
				received_events_url: string
				id: number
				node_id: string
				avatar_url: string
				gravatar_id: string
			}
			assignees_url: string
			branches_url: string
			pushed_at: string
			id: number
			events_url: string
			issues_url: string
			has_downloads: boolean
			private: boolean
			tags_url: string
			stargazers_url: string
			contents_url: string
			clone_url: string
			watchers_count: number
			has_projects: boolean
			open_issues_count: number
			is_template: boolean
			visibility: string
			fork: boolean
			teams_url: string
			git_tags_url: string
			languages_url: string
			svn_url: string
			license: unknown
			topics: Array<unknown>
			html_url: string
			downloads_url: string
			milestones_url: string
			deployments_url: string
			created_at: string
			stargazers_count: number
		}
		organization: {
			members_url: string
			public_members_url: string
			login: string
			repos_url: string
			issues_url: string
			events_url: string
			hooks_url: string
			avatar_url: string
			description: string
			id: number
			node_id: string
			url: string
		}
		sender: {
			id: number
			following_url: string
			gists_url: string
			type: string
			site_admin: boolean
			login: string
			url: string
			organizations_url: string
			repos_url: string
			events_url: string
			avatar_url: string
			gravatar_id: string
			html_url: string
			subscriptions_url: string
			node_id: string
			followers_url: string
			starred_url: string
			received_events_url: string
		}
		action: string
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Github__Delete = {
	name: 'github/delete'
	data: {
		pusher_type: string
		repository: {
			labels_url: string
			releases_url: string
			forks: number
			node_id: string
			events_url: string
			tags_url: string
			git_url: string
			open_issues_count: number
			private: boolean
			issue_events_url: string
			homepage: unknown
			has_projects: boolean
			description: unknown
			clone_url: string
			archived: boolean
			disabled: boolean
			allow_forking: boolean
			has_issues: boolean
			has_pages: boolean
			pulls_url: string
			watchers: number
			hooks_url: string
			trees_url: string
			subscribers_url: string
			contents_url: string
			language: string
			html_url: string
			branches_url: string
			size: number
			open_issues: number
			statuses_url: string
			compare_url: string
			commits_url: string
			issue_comment_url: string
			issues_url: string
			teams_url: string
			languages_url: string
			keys_url: string
			git_commits_url: string
			archive_url: string
			milestones_url: string
			default_branch: string
			full_name: string
			fork: boolean
			url: string
			git_tags_url: string
			subscription_url: string
			visibility: string
			id: number
			owner: {
				html_url: string
				subscriptions_url: string
				events_url: string
				followers_url: string
				gists_url: string
				node_id: string
				url: string
				starred_url: string
				organizations_url: string
				repos_url: string
				received_events_url: string
				login: string
				id: number
				type: string
				site_admin: boolean
				following_url: string
				avatar_url: string
				gravatar_id: string
			}
			forks_count: number
			license: unknown
			assignees_url: string
			pushed_at: string
			contributors_url: string
			comments_url: string
			forks_url: string
			blobs_url: string
			ssh_url: string
			is_template: boolean
			notifications_url: string
			updated_at: string
			has_wiki: boolean
			topics: Array<unknown>
			downloads_url: string
			created_at: string
			stargazers_count: number
			collaborators_url: string
			deployments_url: string
			stargazers_url: string
			merges_url: string
			svn_url: string
			watchers_count: number
			has_downloads: boolean
			mirror_url: unknown
			name: string
			git_refs_url: string
		}
		organization: {
			login: string
			id: number
			node_id: string
			events_url: string
			hooks_url: string
			issues_url: string
			public_members_url: string
			avatar_url: string
			url: string
			repos_url: string
			members_url: string
			description: string
		}
		sender: {
			avatar_url: string
			url: string
			received_events_url: string
			type: string
			site_admin: boolean
			login: string
			node_id: string
			repos_url: string
			events_url: string
			gravatar_id: string
			followers_url: string
			following_url: string
			subscriptions_url: string
			organizations_url: string
			id: number
			html_url: string
			gists_url: string
			starred_url: string
		}
		ref: string
		ref_type: string
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Github__Issue_Comment = {
	name: 'github/issue_comment'
	data: {
		action: string
		organization: {
			issues_url: string
			members_url: string
			description: string
			login: string
			id: number
			url: string
			repos_url: string
			hooks_url: string
			node_id: string
			events_url: string
			public_members_url: string
			avatar_url: string
		}
		sender: {
			node_id: string
			html_url: string
			repos_url: string
			type: string
			id: number
			avatar_url: string
			gravatar_id: string
			following_url: string
			gists_url: string
			site_admin: boolean
			login: string
			url: string
			followers_url: string
			starred_url: string
			subscriptions_url: string
			organizations_url: string
			received_events_url: string
			events_url: string
		}
		issue: {
			user: {
				gists_url: string
				repos_url: string
				received_events_url: string
				site_admin: boolean
				login: string
				url: string
				events_url: string
				followers_url: string
				starred_url: string
				type: string
				avatar_url: string
				subscriptions_url: string
				gravatar_id: string
				html_url: string
				following_url: string
				organizations_url: string
				id: number
				node_id: string
			}
			updated_at: string
			comments_url: string
			draft: boolean
			repository_url: string
			events_url: string
			id: number
			title: string
			author_association: string
			active_lock_reason: unknown
			pull_request: {
				html_url: string
				diff_url: string
				patch_url: string
				merged_at: unknown
				url: string
			}
			locked: boolean
			milestone: unknown
			comments: number
			timeline_url: string
			html_url: string
			state: string
			body: string
			reactions: {
				url: string
				total_count: number
				'+1': number
				'-1': number
				laugh: number
				hooray: number
				eyes: number
				confused: number
				heart: number
				rocket: number
			}
			performed_via_github_app: unknown
			url: string
			created_at: string
			labels_url: string
			labels: Array<unknown>
			assignee: unknown
			assignees: Array<unknown>
			node_id: string
			number: number
			closed_at: unknown
		}
		comment: {
			issue_url: string
			id: number
			user: {
				html_url: string
				events_url: string
				received_events_url: string
				node_id: string
				gravatar_id: string
				repos_url: string
				type: string
				avatar_url: string
				gists_url: string
				url: string
				organizations_url: string
				site_admin: boolean
				login: string
				id: number
				starred_url: string
				subscriptions_url: string
				followers_url: string
				following_url: string
			}
			created_at: string
			updated_at: string
			author_association: string
			body: string
			url: string
			node_id: string
			reactions: {
				'-1': number
				hooray: number
				confused: number
				heart: number
				eyes: number
				url: string
				total_count: number
				'+1': number
				laugh: number
				rocket: number
			}
			performed_via_github_app: unknown
			html_url: string
		}
		repository: {
			issues_url: string
			notifications_url: string
			hooks_url: string
			events_url: string
			assignees_url: string
			tags_url: string
			blobs_url: string
			archive_url: string
			deployments_url: string
			clone_url: string
			has_wiki: boolean
			has_pages: boolean
			full_name: string
			fork: boolean
			open_issues: number
			contributors_url: string
			watchers_count: number
			created_at: string
			has_downloads: boolean
			keys_url: string
			collaborators_url: string
			git_tags_url: string
			comments_url: string
			merges_url: string
			milestones_url: string
			watchers: number
			compare_url: string
			releases_url: string
			homepage: unknown
			size: number
			mirror_url: unknown
			branches_url: string
			commits_url: string
			issue_comment_url: string
			updated_at: string
			stargazers_count: number
			has_issues: boolean
			teams_url: string
			ssh_url: string
			allow_forking: boolean
			visibility: string
			private: boolean
			url: string
			issue_events_url: string
			stargazers_url: string
			has_projects: boolean
			open_issues_count: number
			disabled: boolean
			default_branch: string
			name: string
			owner: {
				following_url: string
				organizations_url: string
				received_events_url: string
				type: string
				login: string
				followers_url: string
				gists_url: string
				starred_url: string
				repos_url: string
				id: number
				url: string
				subscriptions_url: string
				site_admin: boolean
				node_id: string
				avatar_url: string
				gravatar_id: string
				html_url: string
				events_url: string
			}
			description: unknown
			trees_url: string
			contents_url: string
			forks_count: number
			forks_url: string
			languages_url: string
			downloads_url: string
			labels_url: string
			pushed_at: string
			subscribers_url: string
			license: unknown
			node_id: string
			statuses_url: string
			git_commits_url: string
			git_url: string
			svn_url: string
			is_template: boolean
			id: number
			git_refs_url: string
			topics: Array<unknown>
			html_url: string
			subscription_url: string
			pulls_url: string
			archived: boolean
			language: string
			forks: number
		}
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export const Action = {
	OPENED: 'opened',
	CLOSED: 'closed',
	MERGED: 'merged',
	REVIEW_REQUESTED: 'review_requested',
	SYNCHRONIZE: 'synchronize',
	EDITED: 'edited'
} as const
export type Action = typeof Action[keyof typeof Action]

export type Github__Pull_Request = {
	name: 'github/pull_request'
	data: {
		action: Action
		organization: {
			description: string
			events_url: string
			login: string
			public_members_url: string
			repos_url: string
			url: string
			avatar_url: string
			id: number
			issues_url: string
			members_url: string
			node_id: string
			hooks_url: string
		}
		pull_request: {
			diff_url: string
			labels: Array<unknown>
			title: string
			body: string
			closed_at: unknown
			deletions: number
			commits_url: string
			merged_at: unknown
			statuses_url: string
			user: {
				events_url: string
				node_id: string
				organizations_url: string
				type: string
				url: string
				following_url: string
				gists_url: string
				html_url: string
				repos_url: string
				followers_url: string
				id: number
				site_admin: boolean
				starred_url: string
				subscriptions_url: string
				avatar_url: string
				gravatar_id: string
				login: string
				received_events_url: string
			}
			author_association: string
			base: {
				label: string
				ref: string
				repo: {
					branches_url: string
					name: string
					subscribers_url: string
					svn_url: string
					topics: Array<unknown>
					allow_merge_commit: boolean
					git_url: string
					releases_url: string
					assignees_url: string
					events_url: string
					full_name: string
					private: boolean
					trees_url: string
					updated_at: string
					watchers_count: number
					allow_rebase_merge: boolean
					issue_comment_url: string
					issue_events_url: string
					milestones_url: string
					watchers: number
					disabled: boolean
					downloads_url: string
					license: unknown
					merges_url: string
					teams_url: string
					allow_squash_merge: boolean
					collaborators_url: string
					commits_url: string
					contents_url: string
					languages_url: string
					mirror_url: unknown
					visibility: string
					allow_auto_merge: boolean
					archive_url: string
					has_downloads: boolean
					size: number
					ssh_url: string
					statuses_url: string
					allow_forking: boolean
					contributors_url: string
					default_branch: string
					fork: boolean
					forks_url: string
					git_refs_url: string
					keys_url: string
					subscription_url: string
					tags_url: string
					created_at: string
					forks_count: number
					has_wiki: boolean
					open_issues: number
					open_issues_count: number
					is_template: boolean
					allow_update_branch: boolean
					archived: boolean
					forks: number
					git_commits_url: string
					has_issues: boolean
					has_pages: boolean
					html_url: string
					issues_url: string
					blobs_url: string
					compare_url: string
					git_tags_url: string
					labels_url: string
					language: string
					delete_branch_on_merge: boolean
					notifications_url: string
					stargazers_count: number
					clone_url: string
					has_projects: boolean
					id: number
					pulls_url: string
					owner: {
						node_id: string
						organizations_url: string
						repos_url: string
						events_url: string
						html_url: string
						login: string
						avatar_url: string
						type: string
						subscriptions_url: string
						following_url: string
						id: number
						received_events_url: string
						site_admin: boolean
						starred_url: string
						url: string
						followers_url: string
						gists_url: string
						gravatar_id: string
					}
					comments_url: string
					description: string
					homepage: unknown
					pushed_at: string
					stargazers_url: string
					deployments_url: string
					hooks_url: string
					node_id: string
					url: string
				}
				sha: string
				user: {
					events_url: string
					followers_url: string
					following_url: string
					gravatar_id: string
					starred_url: string
					subscriptions_url: string
					site_admin: boolean
					type: string
					node_id: string
					organizations_url: string
					repos_url: string
					avatar_url: string
					gists_url: string
					html_url: string
					id: number
					login: string
					received_events_url: string
					url: string
				}
			}
			before?: string
			after?: string
			milestone: unknown
			node_id: string
			number: number
			requested_teams: Array<unknown>
			comments_url: string
			mergeable_state: string
			merged: boolean
			locked: boolean
			mergeable: unknown
			merged_by: unknown
			patch_url: string
			rebaseable: unknown
			active_lock_reason: unknown
			created_at: string
			head: {
				label: string
				ref: string
				repo: {
					pulls_url: string
					releases_url: string
					compare_url: string
					contributors_url: string
					git_commits_url: string
					issue_events_url: string
					license: unknown
					private: boolean
					updated_at: string
					url: string
					has_projects: boolean
					keys_url: string
					language: string
					notifications_url: string
					pushed_at: string
					size: number
					allow_auto_merge: boolean
					git_tags_url: string
					html_url: string
					id: number
					languages_url: string
					topics: Array<unknown>
					collaborators_url: string
					created_at: string
					has_downloads: boolean
					has_issues: boolean
					is_template: boolean
					name: string
					allow_forking: boolean
					commits_url: string
					contents_url: string
					default_branch: string
					forks: number
					owner: {
						starred_url: string
						subscriptions_url: string
						type: string
						node_id: string
						site_admin: boolean
						organizations_url: string
						repos_url: string
						gists_url: string
						id: number
						events_url: string
						login: string
						following_url: string
						gravatar_id: string
						html_url: string
						received_events_url: string
						url: string
						avatar_url: string
						followers_url: string
					}
					allow_merge_commit: boolean
					archived: boolean
					forks_url: string
					issues_url: string
					subscribers_url: string
					svn_url: string
					tags_url: string
					visibility: string
					allow_squash_merge: boolean
					milestones_url: string
					watchers: number
					comments_url: string
					delete_branch_on_merge: boolean
					git_url: string
					issue_comment_url: string
					statuses_url: string
					subscription_url: string
					deployments_url: string
					fork: boolean
					git_refs_url: string
					merges_url: string
					watchers_count: number
					assignees_url: string
					branches_url: string
					has_wiki: boolean
					allow_update_branch: boolean
					clone_url: string
					description: string
					open_issues: number
					stargazers_url: string
					trees_url: string
					allow_rebase_merge: boolean
					archive_url: string
					blobs_url: string
					full_name: string
					has_pages: boolean
					homepage: unknown
					disabled: boolean
					downloads_url: string
					events_url: string
					forks_count: number
					hooks_url: string
					open_issues_count: number
					mirror_url: unknown
					ssh_url: string
					stargazers_count: number
					teams_url: string
					labels_url: string
					node_id: string
				}
				sha: string
				user: {
					node_id: string
					organizations_url: string
					received_events_url: string
					url: string
					id: number
					repos_url: string
					login: string
					subscriptions_url: string
					type: string
					avatar_url: string
					events_url: string
					gravatar_id: string
					html_url: string
					starred_url: string
					followers_url: string
					following_url: string
					gists_url: string
					site_admin: boolean
				}
			}
			requested_reviewers: Array<unknown>
			assignee: unknown
			comments: number
			html_url: string
			review_comments_url: string
			state: string
			additions: number
			assignees: Array<unknown>
			auto_merge: unknown
			merge_commit_sha: unknown
			id: number
			review_comment_url: string
			review_comments: number
			updated_at: string
			url: string
			draft: boolean
			issue_url: string
			maintainer_can_modify: boolean
		}
		repository: {
			branches_url: string
			html_url: string
			mirror_url: unknown
			size: number
			topics: Array<unknown>
			forks_url: string
			has_issues: boolean
			has_wiki: boolean
			homepage: unknown
			stargazers_url: string
			trees_url: string
			updated_at: string
			compare_url: string
			downloads_url: string
			id: number
			git_url: string
			contributors_url: string
			disabled: boolean
			git_commits_url: string
			keys_url: string
			open_issues: number
			open_issues_count: number
			ssh_url: string
			subscribers_url: string
			collaborators_url: string
			comments_url: string
			fork: boolean
			git_tags_url: string
			node_id: string
			contents_url: string
			deployments_url: string
			notifications_url: string
			owner: {
				login: string
				node_id: string
				repos_url: string
				site_admin: boolean
				url: string
				followers_url: string
				gravatar_id: string
				html_url: string
				id: number
				received_events_url: string
				starred_url: string
				events_url: string
				type: string
				avatar_url: string
				following_url: string
				gists_url: string
				organizations_url: string
				subscriptions_url: string
			}
			releases_url: string
			stargazers_count: number
			blobs_url: string
			issue_events_url: string
			tags_url: string
			default_branch: string
			events_url: string
			hooks_url: string
			statuses_url: string
			forks: number
			has_downloads: boolean
			language: string
			subscription_url: string
			archived: boolean
			created_at: string
			has_pages: boolean
			merges_url: string
			pushed_at: string
			git_refs_url: string
			labels_url: string
			languages_url: string
			license: unknown
			milestones_url: string
			teams_url: string
			description: string
			private: boolean
			pulls_url: string
			svn_url: string
			visibility: string
			forks_count: number
			full_name: string
			is_template: boolean
			issues_url: string
			archive_url: string
			assignees_url: string
			commits_url: string
			has_projects: boolean
			watchers: number
			allow_forking: boolean
			clone_url: string
			issue_comment_url: string
			name: string
			url: string
			watchers_count: number
		}
		sender: {
			events_url: string
			gists_url: string
			login: string
			url: string
			followers_url: string
			following_url: string
			id: number
			site_admin: boolean
			subscriptions_url: string
			type: string
			html_url: string
			node_id: string
			avatar_url: string
			gravatar_id: string
			organizations_url: string
			received_events_url: string
			repos_url: string
			starred_url: string
		}
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Github__Push = {
	name: 'github/push'
	data: {
		before: string
		deleted: boolean
		base_ref: unknown
		forced: boolean
		compare: string
		head_commit: unknown
		ref: string
		repository: {
			git_commits_url: string
			labels_url: string
			ssh_url: string
			git_refs_url: string
			contributors_url: string
			events_url: string
			stargazers_url: string
			created_at: number
			watchers_count: number
			visibility: string
			watchers: number
			branches_url: string
			languages_url: string
			blobs_url: string
			archive_url: string
			has_issues: boolean
			forks_count: number
			disabled: boolean
			html_url: string
			collaborators_url: string
			merges_url: string
			milestones_url: string
			deployments_url: string
			size: number
			has_downloads: boolean
			open_issues_count: number
			url: string
			subscription_url: string
			open_issues: number
			pushed_at: number
			svn_url: string
			stargazers_count: number
			allow_forking: boolean
			master_branch: string
			description: unknown
			teams_url: string
			notifications_url: string
			default_branch: string
			hooks_url: string
			comments_url: string
			issue_comment_url: string
			pulls_url: string
			is_template: boolean
			id: number
			private: boolean
			mirror_url: unknown
			statuses_url: string
			language: string
			stargazers: number
			node_id: string
			full_name: string
			has_wiki: boolean
			keys_url: string
			git_tags_url: string
			trees_url: string
			commits_url: string
			git_url: string
			homepage: unknown
			forks_url: string
			tags_url: string
			releases_url: string
			updated_at: string
			has_pages: boolean
			archived: boolean
			fork: boolean
			contents_url: string
			clone_url: string
			topics: Array<unknown>
			owner: {
				following_url: string
				gists_url: string
				received_events_url: string
				gravatar_id: string
				url: string
				starred_url: string
				events_url: string
				organizations_url: string
				type: string
				site_admin: boolean
				email: string
				node_id: string
				followers_url: string
				subscriptions_url: string
				html_url: string
				repos_url: string
				name: string
				login: string
				id: number
				avatar_url: string
			}
			assignees_url: string
			downloads_url: string
			issues_url: string
			has_projects: boolean
			forks: number
			subscribers_url: string
			compare_url: string
			license: unknown
			organization: string
			name: string
			issue_events_url: string
		}
		created: boolean
		after: string
		pusher: {
			name: string
			email: string
		}
		organization: {
			issues_url: string
			public_members_url: string
			avatar_url: string
			id: number
			node_id: string
			repos_url: string
			events_url: string
			hooks_url: string
			description: string
			login: string
			url: string
			members_url: string
		}
		sender: {
			html_url: string
			followers_url: string
			starred_url: string
			type: string
			id: number
			avatar_url: string
			url: string
			site_admin: boolean
			following_url: string
			subscriptions_url: string
			repos_url: string
			events_url: string
			login: string
			gravatar_id: string
			gists_url: string
			node_id: string
			organizations_url: string
			received_events_url: string
		}
		commits: Array<unknown>
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Github__Workflow_Job = {
	name: 'github/workflow_job'
	data: {
		action: string
		workflow_job: {
			started_at: string
			labels: Array<string>
			runner_id: unknown
			id: number
			url: string
			html_url: string
			conclusion: unknown
			steps: Array<unknown>
			check_run_url: string
			runner_name?: string
			runner_group_id: unknown
			run_id: number
			run_url: string
			node_id: string
			head_sha: string
			runner_group_name: unknown
			run_attempt: number
			status: string
			completed_at: unknown
			name: string
		}
		repository: {
			is_template: boolean
			stargazers_url: string
			notifications_url: string
			homepage: unknown
			issues_url: string
			created_at: string
			git_url: string
			has_issues: boolean
			topics: Array<unknown>
			id: number
			name: string
			blobs_url: string
			milestones_url: string
			url: string
			hooks_url: string
			languages_url: string
			subscription_url: string
			releases_url: string
			mirror_url: unknown
			full_name: string
			language: string
			forks_count: number
			git_refs_url: string
			comments_url: string
			issue_comment_url: string
			contents_url: string
			deployments_url: string
			private: boolean
			owner: {
				id: number
				avatar_url: string
				following_url: string
				organizations_url: string
				type: string
				node_id: string
				gravatar_id: string
				url: string
				html_url: string
				starred_url: string
				repos_url: string
				followers_url: string
				subscriptions_url: string
				events_url: string
				received_events_url: string
				login: string
				gists_url: string
				site_admin: boolean
			}
			html_url: string
			archived: boolean
			license: unknown
			forks: number
			pulls_url: string
			updated_at: string
			disabled: boolean
			visibility: string
			contributors_url: string
			subscribers_url: string
			git_commits_url: string
			teams_url: string
			branches_url: string
			labels_url: string
			size: number
			watchers_count: number
			node_id: string
			fork: boolean
			compare_url: string
			has_pages: boolean
			keys_url: string
			statuses_url: string
			commits_url: string
			has_wiki: boolean
			default_branch: string
			issue_events_url: string
			assignees_url: string
			merges_url: string
			pushed_at: string
			stargazers_count: number
			has_downloads: boolean
			open_issues: number
			description: unknown
			forks_url: string
			downloads_url: string
			events_url: string
			ssh_url: string
			allow_forking: boolean
			collaborators_url: string
			clone_url: string
			svn_url: string
			trees_url: string
			has_projects: boolean
			open_issues_count: number
			watchers: number
			tags_url: string
			git_tags_url: string
			archive_url: string
		}
		organization: {
			members_url: string
			public_members_url: string
			login: string
			id: number
			node_id: string
			url: string
			repos_url: string
			events_url: string
			description: string
			hooks_url: string
			issues_url: string
			avatar_url: string
		}
		sender: {
			login: string
			subscriptions_url: string
			organizations_url: string
			url: string
			gists_url: string
			repos_url: string
			type: string
			site_admin: boolean
			id: number
			node_id: string
			avatar_url: string
			html_url: string
			starred_url: string
			received_events_url: string
			gravatar_id: string
			followers_url: string
			following_url: string
			events_url: string
		}
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Github__Workflow_Run = {
	name: 'github/workflow_run'
	data: {
		action: string
		workflow_run: {
			name: string
			status: string
			conclusion: string
			head_branch: string
			html_url: string
			check_suite_url: string
			workflow_url: string
			run_number: number
			workflow_id: number
			pull_requests: Array<unknown>
			run_attempt: number
			check_suite_node_id: string
			previous_attempt_url: unknown
			run_started_at: string
			rerun_url: string
			head_commit: {
				id: string
				tree_id: string
				message: string
				timestamp: string
				author: {
					name: string
					email: string
				}
				committer: {
					name: string
					email: string
				}
			}
			head_repository: {
				full_name: string
				html_url: string
				assignees_url: string
				git_tags_url: string
				git_refs_url: string
				archive_url: string
				node_id: string
				keys_url: string
				collaborators_url: string
				teams_url: string
				hooks_url: string
				branches_url: string
				compare_url: string
				private: boolean
				forks_url: string
				issue_events_url: string
				issue_comment_url: string
				labels_url: string
				description: unknown
				events_url: string
				commits_url: string
				pulls_url: string
				notifications_url: string
				fork: boolean
				blobs_url: string
				languages_url: string
				contents_url: string
				merges_url: string
				issues_url: string
				owner: {
					gists_url: string
					starred_url: string
					type: string
					node_id: string
					avatar_url: string
					url: string
					html_url: string
					login: string
					site_admin: boolean
					repos_url: string
					events_url: string
					gravatar_id: string
					followers_url: string
					following_url: string
					organizations_url: string
					id: number
					subscriptions_url: string
					received_events_url: string
				}
				trees_url: string
				statuses_url: string
				comments_url: string
				downloads_url: string
				releases_url: string
				deployments_url: string
				subscription_url: string
				milestones_url: string
				git_commits_url: string
				id: number
				name: string
				url: string
				tags_url: string
				stargazers_url: string
				contributors_url: string
				subscribers_url: string
			}
			repository: {
				hooks_url: string
				issue_events_url: string
				assignees_url: string
				statuses_url: string
				languages_url: string
				milestones_url: string
				private: boolean
				branches_url: string
				blobs_url: string
				id: number
				keys_url: string
				subscribers_url: string
				commits_url: string
				compare_url: string
				merges_url: string
				owner: {
					login: string
					avatar_url: string
					following_url: string
					organizations_url: string
					repos_url: string
					received_events_url: string
					site_admin: boolean
					id: number
					gravatar_id: string
					starred_url: string
					node_id: string
					gists_url: string
					subscriptions_url: string
					type: string
					url: string
					html_url: string
					followers_url: string
					events_url: string
				}
				description: unknown
				collaborators_url: string
				stargazers_url: string
				comments_url: string
				labels_url: string
				archive_url: string
				node_id: string
				fork: boolean
				forks_url: string
				teams_url: string
				tags_url: string
				subscription_url: string
				git_commits_url: string
				downloads_url: string
				notifications_url: string
				releases_url: string
				name: string
				full_name: string
				events_url: string
				git_tags_url: string
				trees_url: string
				contributors_url: string
				deployments_url: string
				html_url: string
				url: string
				git_refs_url: string
				issue_comment_url: string
				contents_url: string
				issues_url: string
				pulls_url: string
			}
			event: string
			check_suite_id: number
			updated_at: string
			jobs_url: string
			logs_url: string
			created_at: string
			id: number
			head_sha: string
			url: string
			artifacts_url: string
			cancel_url: string
			node_id: string
		}
		repository: {
			url: string
			pulls_url: string
			mirror_url: unknown
			collaborators_url: string
			teams_url: string
			stargazers_url: string
			comments_url: string
			updated_at: string
			clone_url: string
			archived: boolean
			visibility: string
			hooks_url: string
			assignees_url: string
			git_refs_url: string
			issues_url: string
			has_issues: boolean
			id: number
			contributors_url: string
			issue_comment_url: string
			pushed_at: string
			svn_url: string
			name: string
			fork: boolean
			keys_url: string
			events_url: string
			html_url: string
			description: unknown
			subscription_url: string
			size: number
			license: unknown
			allow_forking: boolean
			node_id: string
			blobs_url: string
			subscribers_url: string
			commits_url: string
			full_name: string
			private: boolean
			milestones_url: string
			labels_url: string
			is_template: boolean
			has_downloads: boolean
			issue_events_url: string
			languages_url: string
			git_commits_url: string
			contents_url: string
			compare_url: string
			merges_url: string
			deployments_url: string
			forks_count: number
			topics: Array<unknown>
			default_branch: string
			downloads_url: string
			open_issues_count: number
			watchers: number
			forks_url: string
			tags_url: string
			watchers_count: number
			disabled: boolean
			has_pages: boolean
			branches_url: string
			archive_url: string
			notifications_url: string
			releases_url: string
			ssh_url: string
			stargazers_count: number
			has_projects: boolean
			forks: number
			open_issues: number
			language: string
			owner: {
				site_admin: boolean
				gravatar_id: string
				repos_url: string
				type: string
				followers_url: string
				starred_url: string
				received_events_url: string
				avatar_url: string
				url: string
				html_url: string
				id: number
				gists_url: string
				subscriptions_url: string
				organizations_url: string
				events_url: string
				login: string
				node_id: string
				following_url: string
			}
			git_tags_url: string
			trees_url: string
			statuses_url: string
			created_at: string
			git_url: string
			homepage: unknown
			has_wiki: boolean
		}
		organization: {
			members_url: string
			login: string
			url: string
			repos_url: string
			events_url: string
			public_members_url: string
			avatar_url: string
			description: string
			id: number
			node_id: string
			hooks_url: string
			issues_url: string
		}
		sender: {
			url: string
			html_url: string
			followers_url: string
			events_url: string
			site_admin: boolean
			starred_url: string
			subscriptions_url: string
			organizations_url: string
			type: string
			gravatar_id: string
			gists_url: string
			received_events_url: string
			login: string
			id: number
			node_id: string
			avatar_url: string
			following_url: string
			repos_url: string
		}
		workflow: {
			html_url: string
			node_id: string
			name: string
			path: string
			state: string
			created_at: string
			id: number
			updated_at: string
			url: string
			badge_url: string
		}
	}
	user: Record<string, never>
	v?: string
	ts?: number
}

export type Stripe__Account_Application_Authorized = {
	data: {
		id: string
		name: unknown
		object: string
	}
	id: string
	ts: number
	name: 'stripe/account.application.authorized'
}

export type Stripe__Balance_Available = {
	name: 'stripe/balance.available'
	data: {
		available: Array<{
			amount: number
			currency: string
			source_types: {
				card: number
			}
		}>
		livemode: boolean
		object: string
		pending: Array<{
			amount: number
			currency: string
			source_types: {
				card: number
			}
		}>
	}
	id: string
	ts: number
}

export type Stripe__Charge_Failed = {
	name: 'stripe/charge.failed'
	data: {
		pending_webhooks: number
		type: string
		id: string
		api_version: string
		created: number
		request: {
			id: string
			idempotency_key: string
		}
		object: string
		data: {
			object: {
				description: string
				invoice: string | null
				order: string | null
				refunds: {
					url: string
					object: string
					data: Array<unknown>
					has_more: boolean
					total_count: number
				}
				review: string | null
				statement_descriptor: unknown
				application_fee_amount: unknown
				billing_details: {
					address: {
						city: string | null
						country: string | null
						line1: string | null
						line2: string | null
						postal_code: string | null
						state: string | null
					}
					email: string | null
					name: string | null
					phone: string | null
				}
				captured: boolean
				paid: boolean
				source: {
					country: string
					last4: string
					id: string
					object: string
					address_city: string | null
					address_line2: string | null
					address_state: string | null
					address_zip_check: string | null
					address_line1: string | null
					cvc_check: string | null
					dynamic_last4: string | null
					exp_month: number
					name: string | null
					tokenization_method: string | null
					address_line1_check: string | null
					address_zip: string | null
					customer: string | null
					exp_year: number
					fingerprint: string
					metadata: Record<string, never>
					address_country: string | null
					brand: string
					funding: string
				}
				statement_descriptor_suffix: unknown
				id: string
				application_fee: unknown
				destination: unknown
				receipt_url: unknown
				refunded: boolean
				status: string
				object: string
				created: number
				fraud_details: Record<string, never>
				livemode: boolean
				metadata: Record<string, never>
				payment_method: string
				receipt_number: unknown
				currency: string
				failure_balance_transaction: unknown
				amount_refunded: number
				calculated_statement_descriptor: string
				outcome: {
					risk_score: number
					seller_message: string
					type: string
					network_status: string
					reason: string
					risk_level: string
				}
				payment_method_details: {
					card: {
						three_d_secure: unknown
						brand: string
						exp_year: number
						installments: unknown
						network: string
						funding: string
						last4: string
						mandate: unknown
						wallet: unknown
						checks: {
							address_postal_code_check: unknown
							cvc_check: unknown
							address_line1_check: unknown
						}
						country: string
						exp_month: number
						fingerprint: string
					}
					type: string
				}
				receipt_email: unknown
				transfer_group: unknown
				amount: number
				amount_captured: number
				on_behalf_of: unknown
				customer: unknown
				dispute: unknown
				failure_message: string
				payment_intent: unknown
				transfer_data: unknown
				application: unknown
				balance_transaction: unknown
				shipping: unknown
				source_transfer: unknown
				disputed: boolean
				failure_code: string
			}
		}
		livemode: boolean
	}
	user: {
		email?: string
	}
	v?: string
	ts?: number
}

export type Stripe__Charge_Pending = {
	data: {
		outcome: unknown
		refunds: {
			object: string
			total_count: number
			url: string
			data: Array<unknown>
			has_more: boolean
		}
		currency: string
		destination: unknown
		failure_balance_transaction: unknown
		failure_message: unknown
		fraud_details: Record<string, never>
		id: string
		review: unknown
		source: unknown
		transfer_group: unknown
		amount_captured: number
		created: number
		disputed: boolean
		payment_method_details: {
			type: string
			us_bank_account: {
				account_type: string
				bank_name: unknown
				fingerprint: string
				last4: string
				routing_number: string
				account_holder_type: string
			}
		}
		amount_refunded: number
		failure_code: unknown
		invoice: unknown
		payment_intent: string
		statement_descriptor_suffix: unknown
		transfer_data: unknown
		receipt_email: unknown
		billing_details: {
			email: unknown
			name: string
			phone: unknown
			address: {
				city: unknown
				country: unknown
				line1: unknown
				line2: unknown
				postal_code: unknown
				state: unknown
			}
		}
		customer: string
		livemode: boolean
		payment_method: string
		receipt_url: unknown
		shipping: unknown
		source_transfer: unknown
		amount: number
		application_fee_amount: unknown
		balance_transaction: unknown
		calculated_statement_descriptor: unknown
		metadata: Record<string, never>
		receipt_number: unknown
		statement_descriptor: unknown
		application: unknown
		application_fee: unknown
		description: unknown
		on_behalf_of: unknown
		refunded: boolean
		status: string
		captured: boolean
		dispute: unknown
		object: string
		order: unknown
		paid: boolean
	}
	id: string
	ts: number
	name: 'stripe/charge.pending'
}

export const UserReport = {
	FRAUDULENT: 'fraudulent',
	SAFE: 'safe'
} as const
export type UserReport = typeof UserReport[keyof typeof UserReport]

export type Stripe__Charge_Succeeded = {
	name: 'stripe/charge.succeeded'
	data: {
		id: string
		type: 'charge.succeeded'
		object: string
		api_version: string
		created: number
		data: {
			object: {
				amount_captured: number
				receipt_number: unknown
				receipt_url: string
				source_transfer: unknown
				statement_descriptor_suffix: unknown
				transfer_data: unknown
				amount: number
				dispute: unknown
				disputed: boolean
				fraud_details: {
					stripe_report?: 'fraudulent'
					user_report?: UserReport
				}
				livemode: boolean
				metadata: Record<string, never>
				order: string | null
				shipping: unknown
				billing_details: {
					address: {
						city: string | null
						country: string | null
						line1: string | null
						line2: string | null
						postal_code: string | null
						state: string | null
					}
					email: string | null
					name: string | null
					phone: string | null
				}
				customer: string | null
				payment_method: string
				transfer_group: unknown
				amount_refunded: number
				refunded: boolean
				review: string | null
				created: number
				balance_transaction: string | null
				on_behalf_of: unknown
				outcome: {
					seller_message: string
					type: string
					network_status: string
					reason: string | null
					risk_level: string
					risk_score: number
				}
				statement_descriptor: unknown
				status: string
				application: unknown
				calculated_statement_descriptor: string
				captured: boolean
				failure_message: string | null
				receipt_email: unknown
				refunds: {
					total_count: number
					url: string
					object: string
					data: Array<unknown>
					has_more: boolean
				}
				application_fee_amount: unknown
				object: string
				paid: boolean
				payment_intent: unknown
				id: string
				currency: string
				description: string
				destination: unknown
				failure_code: unknown
				invoice: unknown
				payment_method_details: {
					card: {
						checks: {
							address_line1_check: unknown
							address_postal_code_check: unknown
							cvc_check: unknown
						}
						country: string
						exp_month: number
						last4: string
						network: string
						three_d_secure: unknown
						brand: string
						exp_year: number
						fingerprint: string
						funding: string
						installments: unknown
						wallet: unknown
					}
					type: string
				}
				source: {
					address_city: string | null
					country: string
					dynamic_last4: string | null
					exp_month: number
					funding: string
					metadata: Record<string, never>
					address_zip: string | null
					customer: string | null
					cvc_check: string | null
					object: string
					address_country: string | null
					brand: string
					exp_year: number
					name: string | null
					fingerprint: string
					last4: string
					id: string
					address_line1: string | null
					address_line1_check: string | null
					address_line2: string | null
					address_state: string | null
					address_zip_check: string | null
					tokenization_method: string | null
				}
				application_fee: unknown
			}
		}
		livemode: boolean
		pending_webhooks: number
		request: {
			id: string
			idempotency_key: string
		}
	}
	user: {
		email?: string
	}
	v?: string
	ts?: number
}

export type Stripe__Charge_Updated = {
	ts: number
	name: 'stripe/charge.updated'
	data: {
		currency: string
		failure_code: unknown
		livemode: boolean
		on_behalf_of: unknown
		order: unknown
		shipping: unknown
		billing_details: {
			address: {
				postal_code: unknown
				state: unknown
				city: unknown
				country: unknown
				line1: unknown
				line2: unknown
			}
			email: unknown
			name: string
			phone: unknown
		}
		captured: boolean
		metadata: Record<string, never>
		paid: boolean
		fraud_details: Record<string, never>
		invoice: unknown
		failure_message: unknown
		object: string
		payment_intent: string
		payment_method: string
		payment_method_details: {
			type: string
			us_bank_account: {
				account_holder_type: string
				account_type: string
				bank_name: unknown
				fingerprint: string
				last4: string
				routing_number: string
			}
		}
		receipt_url: unknown
		description: unknown
		failure_balance_transaction: unknown
		statement_descriptor_suffix: unknown
		review: unknown
		statement_descriptor: unknown
		destination: unknown
		dispute: unknown
		disputed: boolean
		amount_refunded: number
		application_fee: unknown
		balance_transaction: string
		id: string
		receipt_number: unknown
		refunds: {
			data: Array<unknown>
			has_more: boolean
			object: string
			total_count: number
			url: string
		}
		source_transfer: unknown
		status: string
		amount_captured: number
		application_fee_amount: unknown
		source: unknown
		amount: number
		calculated_statement_descriptor: unknown
		transfer_data: unknown
		transfer_group: unknown
		customer: string
		outcome: unknown
		receipt_email: unknown
		refunded: boolean
		application: unknown
		created: number
	}
	id: string
}

export type Stripe__Customer_Created = {
	name: 'stripe/customer.created'
	data: {
		livemode: boolean
		id: string
		data: {
			object: {
				default_source?: string
				delinquent: boolean
				invoice_prefix: string
				invoice_settings: {
					custom_fields?: Array<{
						name: string
						value: string
					}>
					default_payment_method?: string
					footer?: string
				}
				livemode: boolean
				metadata: Record<string, never>
				preferred_locales: Array<string>
				id: string
				name?: string
				shipping: unknown
				balance: number
				currency?: string
				created: number
				address?: {
					city: string | null
					country: string | null
					line1: string | null
					line2: string | null
					postal_code: string | null
					state: string | null
				}
				description: string
				discount?: {
					id: string
					start: number
					end: number
				}
				email?: string
				next_invoice_sequence: number
				phone?: string
				tax_exempt: string
				object: string
			}
		}
		request: {
			id: string
			idempotency_key: string
		}
		pending_webhooks: number
		type: string
		object: string
		api_version: string
		created: number
	}
	user: {
		email?: string
	}
	v?: string
	ts?: number
}

export type Stripe__Customer_Deleted = {
	name: 'stripe/customer.deleted'
	data: {
		preferred_locales: Array<unknown>
		shipping: unknown
		delinquent: boolean
		email: unknown
		name: unknown
		default_currency: unknown
		description: unknown
		discount: unknown
		next_invoice_sequence: number
		address: unknown
		balance: number
		currency: unknown
		tax_exempt: string
		test_clock: unknown
		id: string
		livemode: boolean
		phone: unknown
		invoice_settings: {
			custom_fields: unknown
			default_payment_method: unknown
			footer: unknown
			rendering_options: unknown
		}
		metadata: Record<string, never>
		object: string
		created: number
		default_source: unknown
		invoice_prefix: string
	}
	id: string
	ts: number
}

export type Stripe__Mandate_Updated = {
	name: 'stripe/mandate.updated'
	data: {
		type: string
		customer_acceptance: {
			accepted_at: number
			online: {
				ip_address: string
				user_agent: string
			}
			type: string
		}
		id: string
		object: string
		payment_method_details: {
			type: string
			us_bank_account: Record<string, never>
		}
		status: string
		livemode: boolean
		multi_use: Record<string, never>
		payment_method: string
	}
	id: string
	ts: number
}

export type Stripe__Payment_Intent_Created = {
	name: 'stripe/payment_intent.created'
	data: {
		created: number
		setup_future_usage: string
		amount_received: number
		cancellation_reason: unknown
		confirmation_method: string
		livemode: boolean
		object: string
		transfer_data: unknown
		application: unknown
		application_fee_amount: unknown
		amount_capturable: number
		receipt_email: unknown
		automatic_payment_methods: unknown
		capture_method: string
		amount: number
		amount_details: {
			tip: Record<string, never>
		}
		payment_method_types: Array<string>
		review: unknown
		on_behalf_of: unknown
		payment_method_options: {
			us_bank_account: {
				verification_method: string
			}
		}
		shipping: unknown
		description: unknown
		invoice: unknown
		metadata: Record<string, never>
		payment_method: unknown
		source: unknown
		statement_descriptor: unknown
		status: string
		currency: string
		last_payment_error: unknown
		client_secret: unknown
		customer: string
		id: string
		next_action: unknown
		processing: unknown
		statement_descriptor_suffix: unknown
		canceled_at: unknown
		charges: {
			data: Array<unknown>
			has_more: boolean
			object: string
			total_count: number
			url: string
		}
		transfer_group: unknown
	}
	id: string
	ts: number
}

export type Stripe__Payment_Intent_Payment_Failed = {
	name: 'stripe/payment_intent.payment_failed'
	data: {
		status: string
		automatic_payment_methods: unknown
		next_action: unknown
		object: string
		payment_method_options: {
			us_bank_account: {
				verification_method: string
			}
		}
		receipt_email: unknown
		client_secret: unknown
		id: string
		payment_method: unknown
		processing: unknown
		amount_received: number
		canceled_at: unknown
		capture_method: string
		currency: string
		description: unknown
		source: unknown
		transfer_group: unknown
		amount: number
		amount_details: {
			tip: Record<string, never>
		}
		cancellation_reason: unknown
		on_behalf_of: unknown
		statement_descriptor_suffix: unknown
		customer: string
		invoice: unknown
		application_fee_amount: unknown
		charges: {
			data: Array<{
				description: unknown
				statement_descriptor: unknown
				transfer_data: unknown
				created: number
				customer: string
				failure_code: string
				refunds: {
					data: Array<unknown>
					has_more: boolean
					object: string
					total_count: number
					url: string
				}
				statement_descriptor_suffix: unknown
				amount: number
				application_fee: unknown
				destination: unknown
				fraud_details: Record<string, never>
				on_behalf_of: unknown
				order: unknown
				outcome: {
					network_status: string
					reason: string
					risk_level: string
					seller_message: string
					type: string
				}
				payment_method: string
				amount_refunded: number
				receipt_email: unknown
				calculated_statement_descriptor: unknown
				currency: string
				failure_balance_transaction: string
				id: string
				metadata: Record<string, never>
				shipping: unknown
				source: unknown
				billing_details: {
					address: {
						postal_code: unknown
						state: unknown
						city: unknown
						country: unknown
						line1: unknown
						line2: unknown
					}
					email: unknown
					name: string
					phone: unknown
				}
				balance_transaction: string
				disputed: boolean
				payment_intent: string
				receipt_number: unknown
				source_transfer: unknown
				transfer_group: unknown
				application: unknown
				review: unknown
				paid: boolean
				application_fee_amount: unknown
				dispute: unknown
				failure_message: string
				invoice: unknown
				livemode: boolean
				object: string
				payment_method_details: {
					type: string
					us_bank_account: {
						account_type: string
						bank_name: unknown
						fingerprint: string
						last4: string
						routing_number: string
						account_holder_type: string
					}
				}
				amount_captured: number
				refunded: boolean
				status: string
				receipt_url: unknown
				captured: boolean
			}>
			has_more: boolean
			object: string
			total_count: number
			url: string
		}
		payment_method_types: Array<string>
		setup_future_usage: string
		shipping: unknown
		transfer_data: unknown
		application: unknown
		confirmation_method: string
		last_payment_error: {
			code: string
			decline_code: string
			message: string
			payment_method: {
				metadata: Record<string, never>
				object: string
				us_bank_account: {
					account_holder_type: string
					account_type: string
					bank_name: unknown
					financial_connections_account: string
					fingerprint: string
					last4: string
					networks: {
						supported: Array<string>
						preferred: string
					}
					routing_number: string
				}
				billing_details: {
					email: unknown
					name: string
					phone: unknown
					address: {
						city: unknown
						country: unknown
						line1: unknown
						line2: unknown
						postal_code: unknown
						state: unknown
					}
				}
				created: number
				customer: string
				id: string
				livemode: boolean
				type: string
			}
			type: string
		}
		review: unknown
		statement_descriptor: unknown
		amount_capturable: number
		created: number
		livemode: boolean
		metadata: Record<string, never>
	}
	id: string
	ts: number
}

export type Stripe__Payment_Intent_Processing = {
	name: 'stripe/payment_intent.processing'
	data: {
		transfer_data: unknown
		transfer_group: unknown
		amount_received: number
		canceled_at: unknown
		cancellation_reason: unknown
		invoice: unknown
		next_action: unknown
		on_behalf_of: unknown
		last_payment_error: unknown
		object: string
		payment_method_types: Array<string>
		charges: {
			object: string
			total_count: number
			url: string
			data: Array<{
				failure_balance_transaction: unknown
				id: string
				livemode: boolean
				receipt_url: unknown
				refunded: boolean
				shipping: unknown
				amount: number
				calculated_statement_descriptor: unknown
				dispute: unknown
				disputed: boolean
				metadata: Record<string, never>
				order: unknown
				payment_method_details: {
					type: string
					us_bank_account: {
						fingerprint: string
						last4: string
						routing_number: string
						account_holder_type: string
						account_type: string
						bank_name: unknown
					}
				}
				transfer_data: unknown
				description: unknown
				paid: boolean
				receipt_email: unknown
				refunds: {
					url: string
					data: Array<unknown>
					has_more: boolean
					object: string
					total_count: number
				}
				application_fee: unknown
				destination: unknown
				object: string
				on_behalf_of: unknown
				payment_method: string
				source: unknown
				source_transfer: unknown
				status: string
				currency: string
				customer: string
				invoice: unknown
				amount_refunded: number
				application: unknown
				application_fee_amount: unknown
				balance_transaction: unknown
				failure_code: unknown
				fraud_details: Record<string, never>
				outcome: unknown
				transfer_group: unknown
				captured: boolean
				created: number
				receipt_number: unknown
				review: unknown
				statement_descriptor_suffix: unknown
				amount_captured: number
				billing_details: {
					email: unknown
					name: string
					phone: unknown
					address: {
						city: unknown
						country: unknown
						line1: unknown
						line2: unknown
						postal_code: unknown
						state: unknown
					}
				}
				failure_message: unknown
				payment_intent: string
				statement_descriptor: unknown
			}>
			has_more: boolean
		}
		client_secret: unknown
		processing: unknown
		source: unknown
		statement_descriptor: unknown
		amount: number
		capture_method: string
		created: number
		currency: string
		review: unknown
		status: string
		shipping: unknown
		amount_capturable: number
		automatic_payment_methods: unknown
		id: string
		livemode: boolean
		metadata: Record<string, never>
		receipt_email: unknown
		amount_details: {
			tip: Record<string, never>
		}
		confirmation_method: string
		customer: string
		setup_future_usage: string
		statement_descriptor_suffix: unknown
		application: unknown
		application_fee_amount: unknown
		description: unknown
		payment_method: string
		payment_method_options: {
			us_bank_account: {
				verification_method: string
			}
		}
	}
	id: string
	ts: number
}

export type Stripe__Payment_Intent_Succeeded = {
	data: {
		description: unknown
		next_action: unknown
		receipt_email: unknown
		review: unknown
		amount_received: number
		automatic_payment_methods: unknown
		capture_method: string
		client_secret: unknown
		statement_descriptor: unknown
		id: string
		setup_future_usage: string
		amount: number
		amount_details: {
			tip: Record<string, never>
		}
		created: number
		customer: string
		payment_method: string
		shipping: unknown
		amount_capturable: number
		cancellation_reason: unknown
		livemode: boolean
		object: string
		metadata: Record<string, never>
		on_behalf_of: unknown
		statement_descriptor_suffix: unknown
		status: string
		transfer_data: unknown
		application: unknown
		application_fee_amount: unknown
		canceled_at: unknown
		confirmation_method: string
		charges: {
			url: string
			data: Array<{
				customer: string
				description: unknown
				destination: unknown
				livemode: boolean
				payment_method: string
				balance_transaction: string
				disputed: boolean
				failure_message: unknown
				invoice: unknown
				paid: boolean
				receipt_email: unknown
				refunded: boolean
				status: string
				transfer_data: unknown
				amount_captured: number
				application_fee: unknown
				created: number
				dispute: unknown
				transfer_group: unknown
				payment_intent: string
				refunds: {
					data: Array<unknown>
					has_more: boolean
					object: string
					total_count: number
					url: string
				}
				application_fee_amount: unknown
				currency: string
				fraud_details: Record<string, never>
				id: string
				metadata: Record<string, never>
				order: unknown
				receipt_url: string
				review: unknown
				amount: number
				amount_refunded: number
				source_transfer: unknown
				application: unknown
				billing_details: {
					phone: unknown
					address: {
						city: unknown
						country: unknown
						line1: unknown
						line2: unknown
						postal_code: unknown
						state: unknown
					}
					email: unknown
					name: string
				}
				failure_balance_transaction: unknown
				failure_code: unknown
				object: string
				on_behalf_of: unknown
				shipping: unknown
				statement_descriptor: unknown
				statement_descriptor_suffix: unknown
				calculated_statement_descriptor: unknown
				captured: boolean
				outcome: {
					reason: unknown
					risk_level: string
					seller_message: string
					type: string
					network_status: string
				}
				payment_method_details: {
					type: string
					us_bank_account: {
						account_holder_type: string
						account_type: string
						bank_name: unknown
						fingerprint: string
						last4: string
						routing_number: string
					}
				}
				receipt_number: unknown
				source: unknown
			}>
			has_more: boolean
			object: string
			total_count: number
		}
		payment_method_types: Array<string>
		source: unknown
		transfer_group: unknown
		invoice: unknown
		payment_method_options: {
			us_bank_account: {
				verification_method: string
			}
		}
		currency: string
		last_payment_error: unknown
		processing: unknown
	}
	id: string
	ts: number
	name: 'stripe/payment_intent.succeeded'
}

export type Stripe__Payment_Method_Attached = {
	data: {
		livemode: boolean
		object: string
		type: string
		billing_details: {
			address: {
				line1: unknown
				line2: unknown
				postal_code: unknown
				state: unknown
				city: unknown
				country: unknown
			}
			email: unknown
			name: string
			phone: unknown
		}
		created: number
		metadata: Record<string, never>
		us_bank_account: {
			account_holder_type: string
			account_type: string
			bank_name: unknown
			financial_connections_account: string
			fingerprint: string
			last4: string
			networks: {
				preferred: string
				supported: Array<string>
			}
			routing_number: string
		}
		customer: string
		id: string
	}
	id: string
	ts: number
	name: 'stripe/payment_method.attached'
}

export type Stripe__Payout_Created = {
	name: 'stripe/payout.created'
	data: {
		description: string
		id: string
		metadata: Record<string, never>
		original_payout: unknown
		reversed_by: unknown
		source_type: string
		amount: number
		currency: string
		created: number
		failure_message: unknown
		statement_descriptor: unknown
		automatic: boolean
		balance_transaction: string
		livemode: boolean
		failure_balance_transaction: unknown
		failure_code: unknown
		method: string
		object: string
		status: string
		type: string
		arrival_date: number
		destination: string
	}
	id: string
	ts: number
}

export type Stripe__Payout_Paid = {
	data: {
		automatic: boolean
		currency: string
		id: string
		method: string
		original_payout: unknown
		source_type: string
		amount: number
		balance_transaction: string
		created: number
		description: string
		failure_code: unknown
		failure_message: unknown
		metadata: Record<string, never>
		arrival_date: number
		destination: string
		reversed_by: unknown
		statement_descriptor: unknown
		status: string
		type: string
		failure_balance_transaction: unknown
		livemode: boolean
		object: string
	}
	id: string
	ts: number
	name: 'stripe/payout.paid'
}

type CustomEvent = {
	name: string
	data: Record<string, any>
	user?: Record<string, any>
}

type GeneratedEvents = Readonly<{
	'demo/event.sent': Readonly<Demo__Event_Sent>
	'github/check_suite': Readonly<Github__Check_Suite>
	'github/delete': Readonly<Github__Delete>
	'github/issue_comment': Readonly<Github__Issue_Comment>
	'github/pull_request': Readonly<Github__Pull_Request>
	'github/push': Readonly<Github__Push>
	'github/workflow_job': Readonly<Github__Workflow_Job>
	'github/workflow_run': Readonly<Github__Workflow_Run>
	'stripe/account.application.authorized': Readonly<Stripe__Account_Application_Authorized>
	'stripe/balance.available': Readonly<Stripe__Balance_Available>
	'stripe/charge.failed': Readonly<Stripe__Charge_Failed>
	'stripe/charge.pending': Readonly<Stripe__Charge_Pending>
	'stripe/charge.succeeded': Readonly<Stripe__Charge_Succeeded>
	'stripe/charge.updated': Readonly<Stripe__Charge_Updated>
	'stripe/customer.created': Readonly<Stripe__Customer_Created>
	'stripe/customer.deleted': Readonly<Stripe__Customer_Deleted>
	'stripe/mandate.updated': Readonly<Stripe__Mandate_Updated>
	'stripe/payment_intent.created': Readonly<Stripe__Payment_Intent_Created>
	'stripe/payment_intent.payment_failed': Readonly<Stripe__Payment_Intent_Payment_Failed>
	'stripe/payment_intent.processing': Readonly<Stripe__Payment_Intent_Processing>
	'stripe/payment_intent.succeeded': Readonly<Stripe__Payment_Intent_Succeeded>
	'stripe/payment_method.attached': Readonly<Stripe__Payment_Method_Attached>
	'stripe/payout.created': Readonly<Stripe__Payout_Created>
	'stripe/payout.paid': Readonly<Stripe__Payout_Paid>
}>

/**
 * Events generated from real data in your Inngest Cloud account. Can be passed
 * an object containing custom events if you wisht to send events not yet in
 * your ecosystem.
 *
 * ```ts
 * const inngest = new Inngest<
 *   Events<{
 *     "app/user.created": {
 *       data: { id: string; email: string };
 *     };
 *   }>
 * >({ name: "My App" });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Events<CustomEvents extends Record<string, CustomEvent> = {}> =
	Readonly<Omit<CustomEvents, keyof GeneratedEvents> & GeneratedEvents>