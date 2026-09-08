import TeacherAssessable from '@site/packages/brr/digital-exams/model';
import { useStore } from '@tdev-hooks/useStore';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

interface Props {
    doc: TeacherAssessable;
}

const TeacherAssessablePoints = observer((props: Props) => {
    const userStore = useStore('userStore');

    if (!userStore.current?.hasElevatedAccess) {
        return props.doc.points;
    }

    return (
        <input
            type="number"
            value={props.doc.points ?? 0}
            className={clsx(styles.pointsInput)}
            onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                    props.doc.setPoints(value);
                }
            }}
        />
    );
});

export default TeacherAssessablePoints;
