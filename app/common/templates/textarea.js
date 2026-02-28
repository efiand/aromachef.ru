/** @type {(params: TextareaParams) => string} */
export function renderTextarea({
	className = '',
	isArticle,
	isEditor = true,
	isRequired,
	label,
	maxlength = 3000,
	name,
	rows = 5,
	value = '',
}) {
	return /* html */ `
		<div class="form-group ${className}">
			${
				label
					? /* html */ `
						<label ${isRequired ? 'class="_required"' : ''} for="${name}">
							${label}
						</label>
					`
					: ''
			}
			${value ? /* html */ `<!-- html-validate-disable-next no-raw-characters: HTML in textarea -->` : ''}
			<textarea
				${label ? `id="${name}"` : ''}
				name="${name}"
				maxlength="${maxlength}"
				rows="${rows}"
				${isRequired ? 'required' : ''}\
				${isEditor ? 'data-component="editor"' : ''}
				${isArticle ? 'data-article' : ''}
			>${value || ''}</textarea>
		</div>
	`;
}
