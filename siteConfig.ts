// This file is never changed by teaching-dev.
// Use it to override or extend your app configuration.

import { SiteConfigProvider } from '@tdev/siteConfig/siteConfig';
import { DevDocsNavbarItem } from './navbarItems';
import {
    accountSwitcher,
    loginProfileButton,
    personalSpaceOverlay,
    requestTarget,
    taskStateOverview
} from './src/siteConfig/navbarItems';

const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

const getSiteConfig: SiteConfigProvider = () => {
    return {
        title: 'classrooms.app',
        tagline: 'Classrooms',
        url: 'https://classrooms.app',
        siteStyles: ['website/css/custom.scss'],
        navbarItems: [
            taskStateOverview,
            DevDocsNavbarItem,
            accountSwitcher,
            requestTarget,
            personalSpaceOverlay,
            loginProfileButton
        ].filter((item) => !!item),
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Tools',
                    items: [
                        {
                            label: 'Thonny',
                            to: 'https://thonny.org/'
                        },
                        {
                            label: 'VS Code',
                            to: 'https://code.visualstudio.com/'
                        },
                        {
                            label: 'Python',
                            to: 'https://www.python.org/'
                        }
                    ]
                },
                {
                    title: 'Meine Schule',
                    items: [
                        {
                            label: 'Passwort zurücksetzen',
                            to: 'https://password.edubern.ch/'
                        },
                        {
                            label: 'GBSL',
                            to: 'https://gbsl.ch'
                        },
                        {
                            label: 'Intranet',
                            to: 'https://erzbe.sharepoint.com/sites/GYMB/gbs'
                        },
                        {
                            label: 'Stundenplan',
                            to: 'https://gym-biel-bienne.webuntis.com/WebUntis/#/basic/timetablePublic'
                        },
                        {
                            label: '🧑🏽‍💻 Anleitungen BYOD / ICT',
                            to: 'https://ict.gbsl.website/'
                        },
                        {
                            label: '⛑️ IT-Support',
                            to: 'https://ict.gbsl.website/support'
                        },
                        {
                            label: "🍜 Was gibt's heute in der Mensa?",
                            to: 'https://clients.scolarest.ch/gymbiel/de/Mensa'
                        }
                    ]
                }
            ],
            copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                          <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">© ${new Date().getFullYear()} Silas Berger</a> | Ausnahmen sind gekennzeichnet.<br/>
                          <a class="badge badge--primary" href="https://github.com/SilasBerger/teaching-website/commits/${GIT_COMMIT_SHA}">
                            ᚶ ${GIT_COMMIT_SHA.substring(0, 7)}</a>`
        }
    };
};

export default getSiteConfig;
