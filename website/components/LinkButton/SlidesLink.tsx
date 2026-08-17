import { mdiMicrosoftPowerpoint } from '@mdi/js';
import LinkButton from '.';

interface Props {
    url: string;
}

const SlidesLink = ({ url }: Props) => {
    return (
        <LinkButton
            label="Unterrichtsfolien zu diesem Themenblock"
            url={url}
            icon={mdiMicrosoftPowerpoint}
            iconColor="#c43e1b"
        />
    );
};

export default SlidesLink;
