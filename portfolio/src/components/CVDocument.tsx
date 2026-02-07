// src/components/CVDocument.tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Inter',
    src: '/fonts/Inter-Regular.ttf'
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Inter',
        fontSize: 10,
        padding: 40,
    },
    header: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    experienceItem: {
        marginBottom: 10,
    },
    company: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

interface CVDocumentProps {
    person: {
        name: string;
        role: string;
    };
    work: {
        experiences: Array<{
            company: string;
            role: string;
            timeframe: string;
            achievements: string[];
        }>;
    };
    technical: {
        skills: Array<{
            title: string;
            description: string;
        }>;
    };
}

export const CVDocument = ({ person, work, technical }: CVDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{person.name}</Text>
                <Text style={styles.role}>{person.role}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {work.experiences.map((exp, i) => (
                    <View key={i} style={styles.experienceItem}>
                        <Text style={styles.company}>{exp.company}</Text>
                        <Text>{exp.role}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);