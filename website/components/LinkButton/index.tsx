import clsx from 'clsx';
import styles from './styles.module.scss';
import { mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
    label: string;
    url: string;
    icon: string;
    iconColor?: string;
    iconSize?: number;
}

const SlidesLink = ({ label, url, icon, iconColor, iconSize }: Props) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={clsx(styles.link)}>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.logoContainer)}>
                    <Icon path={icon} size={iconSize || 4} color={iconColor || 'var(--ifm-color-primary)'} />
                </div>
                <div className={clsx(styles.textContainer)}>{label}</div>
                <Icon path={mdiOpenInNew} size={0.8} className={clsx(styles.linkIcon)} color="#898989" />
            </div>
        </a>
    );
};

export default SlidesLink;
