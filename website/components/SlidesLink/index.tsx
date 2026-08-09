import clsx from 'clsx';
import styles from './styles.module.scss';
import { mdiLinkBoxVariant, mdiMicrosoftPowerpoint, mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
    url: string;
}

const SlidesLink = ({ url }: Props) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={clsx(styles.link)}>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.logoContainer)}>
                    <Icon path={mdiMicrosoftPowerpoint} size={4} color="#c43e1b" />
                </div>
                <div className={clsx(styles.textContainer)}>Unterrichtsfolien zu diesem Themenblock</div>
                <Icon path={mdiOpenInNew} size={0.8} className={clsx(styles.linkIcon)} color="#898989" />
            </div>
        </a>
    );
};

export default SlidesLink;
