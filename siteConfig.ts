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
import { PluginConfig } from '@docusaurus/types';
import { VersionOptions } from '@docusaurus/plugin-content-docs';
import versions from './versions.json' with { type: 'json' };

const SCAVENGER_API_BASE_URL = process.env.SCAVENGER_API_BASE_URL;
const DIRECTUS_URL = process.env.DIRECTUS_URL;

const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

const ADMONITION_CONFIG = {
    admonitions: {
        keywords: ['aufgabe', 'insight', 'key', 'definition', 'tip', 'info', 'note'],
        extendDefaults: true
    }
};

export const brythonCodePluginConfig: PluginConfig = [
    require.resolve('@tdev/brython-code/plugin'),
    {
        brythonSrc: 'https://cdn.jsdelivr.net/npm/brython@3.13.2/brython.min.js',
        brythonStdlibSrc: 'https://cdn.jsdelivr.net/npm/brython@3.13.2/brython_stdlib.js',
        libDir: '/bry-libs/'
    }
];

const VERSIONS: { [version: string]: VersionOptions } = {
    current: {
        label: 'Material',
        banner: 'none'
    }
};
if (!process.env.DOCS_ONLY) {
    versions.forEach((version) => {
        VERSIONS[version] = {
            label: version,
            banner: 'none',
            badge: false
        };
    });
}

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
        },
        onBrokenLinks: 'warn',
        personalSpaceDocRootId: 'f00a2e3e-c7f9-4dbe-ad02-6546daf72477',
        themeConfig: {
            algolia: {
                appId: 'Q2EWIP1F49',
                apiKey: '8f75046084437d3265e53a6b78c7c2e0',
                indexName: 'classrooms.app',
                searchPagePath: 'search'
            }
        },
        scripts: [
            {
                src: 'https://umami.gbsl.website/tell-me.js',
                ['data-website-id']: process.env.UMAMI_ID,
                ['data-domains']: 'classrooms.app',
                async: true,
                defer: true
            }
        ],
        gitHub: {
            orgName: 'SilasBerger',
            projectName: 'teaching-website'
        },
        tdevConfig: {
            taskStateOverview: {
                hideTeachers: true
            },
            excalidraw: {
                excalidoc: true
            }
        },
        transformers: {
            customFields: (current: Record<string, unknown> | undefined) => ({
                ...(current || {}),
                SCAVENGER_API_BASE_URL,
                DIRECTUS_URL
            })
        },
        plugins: [brythonCodePluginConfig],
        docs: {
            ...ADMONITION_CONFIG,
            versions: VERSIONS,
            lastVersion: 'current',
            routeBasePath: '/',
            exclude: process.env.NODE_ENV === 'production' ? ['tdev/**'] : [],
            showLastUpdateTime: true,
            includeCurrentVersion: true,
            sidebarCollapsible: true
        },
        pages: ADMONITION_CONFIG,
        apiDocumentProviders: [
            require.resolve('@tdev/netpbm-graphic/register'),
            require.resolve('@tdev/text-message/register'),
            require.resolve('@tdev/pyodide-code/register'),
            require.resolve('@tdev/brython-code/register'),
            require.resolve('@tdev/page-read-check/register')
        ]
    };
};

export default getSiteConfig;
