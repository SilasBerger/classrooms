import Icon from '@mdi/react';
import styles from './styles.module.scss';
import { mdiCalendarRemove } from '@mdi/js';
import { IfmColors } from '@tdev-components/shared/Colors';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useStore } from '@tdev-hooks/useStore';
import { useLocation } from '@docusaurus/router';
import { observer } from 'mobx-react-lite';
import User from '@tdev-models/User';
import LiveStatusIndicator from '@tdev-components/LiveStatusIndicator';

interface Termin {
    cells: string[];
}

interface Props {
    termine: Termin[];
    terminePraktikum?: Termin[];
}

const PRAKTIKUM_GROUP_NAME_PATTERNS = (klass: string, praktikumGroup: string) => [
    `${klass}-${praktikumGroup}`,
    `${klass} HK${praktikumGroup}`,
    `${klass} HK-${praktikumGroup}`,
    `${klass}-HK-${praktikumGroup}`
];

const takesPlaceToday = (dateInfos: DateInfo[]): DateInfo | undefined => {
    const today = new Date();
    return dateInfos.find(
        (dateInfo) =>
            dateInfo.date.getDate() === today.getDate() &&
            dateInfo.date.getMonth() === today.getMonth() &&
            dateInfo.date.getFullYear() === today.getFullYear()
    );
};

interface DateInfo {
    date: Date;
    praktikumGroup?: string;
}

const dateInfos = (termine: Termin[]): DateInfo[] => {
    return termine.map((termin) => {
        const dateStr = termin.cells[0];
        const [day, month, year] = dateStr.split('.').map(Number);
        return {
            date: new Date(year, month - 1, day),
            praktikumGroup: termin.cells[1] || undefined
        };
    });
};

enum ScheduleType {
    Informatik,
    Praktikum,
    Both,
    Neither
}

interface ScheduleInfo {
    type: ScheduleType;
    praktikumGroup?: string;
}

const getScheduleInfo = (termine: Termin[], terminePraktikum: Termin[]): ScheduleInfo => {
    const informatikToday = takesPlaceToday(dateInfos(termine));
    const praktikumToday = takesPlaceToday(dateInfos(terminePraktikum));

    if (informatikToday && praktikumToday) {
        return {
            type: ScheduleType.Both,
            praktikumGroup: praktikumToday.praktikumGroup
        };
    } else if (informatikToday) {
        return { type: ScheduleType.Informatik };
    } else if (praktikumToday) {
        return {
            type: ScheduleType.Praktikum,
            praktikumGroup: praktikumToday.praktikumGroup
        };
    } else {
        return { type: ScheduleType.Neither };
    }
};

const StudentBadge = ({ user }: { user: User }) => {
    return (
        <div className={styles.studentBadge} key={user.id}>
            <LiveStatusIndicator userId={user.id} size={0.3} className={styles.liveIndicator} />

            <span>
                {user.firstName} {user.lastName}
            </span>
        </div>
    );
};

const AttendanceList = ({ title, students }: { title: string; students: User[] }) => {
    return (
        <div>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.studentList}>
                {(students || []).map((user) => (
                    <StudentBadge key={user.id} user={user} />
                ))}
            </div>
            <div className={styles.studentCount}>
                <span className="badge badge--info">
                    {students.filter((student) => student.connectedClients > 0).length}/{students.length}
                </span>
            </div>
        </div>
    );
};

const AttendanceCheck = observer(({ termine, terminePraktikum }: Props) => {
    const isBrowser = useIsBrowser();
    const userStore = useStore('userStore');
    const location = useLocation();

    if (!isBrowser || !userStore.current?.hasElevatedAccess) {
        return null;
    }

    const scheduleInfo = getScheduleInfo(termine, terminePraktikum || []);

    if (scheduleInfo.type === ScheduleType.Neither) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Anwesenheitskontrolle</h2>
                <div className={styles.noLesson}>
                    <Icon path={mdiCalendarRemove} size={1} color={IfmColors.primary} />
                    <span>Heute findet keine Lektion mit dieser Klasse statt.</span>
                </div>
            </div>
        );
    }

    const klass = location.pathname.split('/')[1];
    const informatikStudents: User[] = userStore.managedUsers.filter((u) =>
        u.studentGroups.some((g) => g.name === klass)
    );
    const praktikumStudents: User[] = scheduleInfo.praktikumGroup
        ? userStore.managedUsers.filter((u) =>
              u.studentGroups.some((g) =>
                  PRAKTIKUM_GROUP_NAME_PATTERNS(klass, scheduleInfo.praktikumGroup!).includes(g.name)
              )
          )
        : [];

    return (
        <div className={styles.container}>
            {(scheduleInfo.type === ScheduleType.Informatik || scheduleInfo.type === ScheduleType.Both) && (
                <AttendanceList title="Anwesenheitskontrolle Informatik" students={informatikStudents} />
            )}
            {(scheduleInfo.type === ScheduleType.Praktikum || scheduleInfo.type === ScheduleType.Both) && (
                <AttendanceList title="Anwesenheitskontrolle Praktikum" students={praktikumStudents} />
            )}
        </div>
    );
});

export default AttendanceCheck;
