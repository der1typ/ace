import React from 'react';

import { I18nextProvider } from 'react-i18next';

import { ThemeProvider } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { customTheme } from 'app/theme';
import i18n, { SupportedLanguage } from 'app/i18n';
import App from 'app/app';
import DataProvider from 'app/providers/DataProvider';

interface RendererProps {
}

const Renderer: React.FC<RendererProps> = (props) => {
    const [ lang, setLang ] = React.useState<SupportedLanguage>('en-US');

	i18n.changeLanguage(lang);

	return (
		<ThemeProvider theme={customTheme}>
			<I18nextProvider i18n={i18n}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DataProvider>
						<App />
					</DataProvider>
				</MuiPickersUtilsProvider>
			</I18nextProvider>
		</ThemeProvider>
	);
};

export default Renderer;
