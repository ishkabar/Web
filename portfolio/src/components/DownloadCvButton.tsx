'use client';

import { Button } from '@once-ui-system/core';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet,Font } from '@react-pdf/renderer';


Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
            fontWeight: 300,
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
            fontWeight: 400,
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
            fontWeight: 500,
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
            fontWeight: 700,
        },
    ],
});

const pdfStyles = StyleSheet.create({
    page: {
        fontSize: 10,
        padding: 30,
        fontFamily: 'Roboto',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 25,
        paddingBottom: 15,
        borderBottom: '2pt solid #2563eb', // niebieski accent
    },
    name: {
        fontSize: 28,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 5,
    },
    role: {
        fontSize: 14,
        color: '#2563eb', // niebieski
        fontWeight: 500,
        marginBottom: 8,
    },
    location: {
        fontSize: 9,
        color: '#6b7280',
    },
    section: {
        marginTop: 20,
        paddingTop: 12,
        borderTop: '1pt solid #e5e7eb',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 12,
        color: '#1f2937',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    experienceItem: {
        marginBottom: 18,
        paddingLeft: 8,
        borderLeft: '3pt solid #dbeafe', // jasnoniebieski accent
        paddingBottom: 12,
    },
    companyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        backgroundColor: '#f3f4f6', // ciemniejszy szary (było #f9fafb)
        padding: '6 8',
        borderRadius: 3,
    },
    company: {
        fontSize: 12,
        fontWeight: 700,
        color: '#111827',
    },
    timeframe: {
        fontSize: 9,
        color: '#6b7280',
        fontWeight: 500,
    },
    experienceRole: {
        fontSize: 9,
        color: '#2563eb',
        marginBottom: 5,
        marginTop: 3,
        marginLeft: 8,
        fontWeight: 500,
    },
    achievement: {
        fontSize: 8,
        marginBottom: 3,
        paddingLeft: 10,
        color: '#374151',
        lineHeight: 1.3,
    },
    skillItem: {
        marginBottom: 10,
        backgroundColor: '#f9fafb',
        padding: 6,
        borderRadius: 4,
        borderLeft: '3pt solid #2563eb',
    },
    skillTitle: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 4,
        color: '#111827',
    },
    skillDescription: {
        fontSize: 9,
        color: '#4b5563',
        marginBottom: 6,
        lineHeight: 1.3,
    },
    skillTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    tag: {
        fontSize: 8,
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '3 8',
        borderRadius: 3,
        fontWeight: 500,
    },
    institution: {
        marginBottom: 12,
        paddingLeft: 8,
        borderLeft: '3pt solid #dbeafe',
    },
    institutionName: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 3,
        color: '#111827',
    },
    institutionDesc: {
        fontSize: 9,
        color: '#6b7280',
        lineHeight: 1.3,
    },
});

interface CVData {
    person: {
        name: string;
        role: string;
        location: string;
    };
    work: {
        title: string;
        experiences: Array<{
            company: string;
            role: string;
            timeframe: string;
            achievements: string[];
        }>;
    };
    studies: {
        title: string;
        institutions: Array<{
            name: string;
            description: string;
        }>;
    };
    technical: {
        title: string;
        skills: Array<{
            title: string;
            description: string;
            tags?: Array<{ name: string }>;
        }>;
    };
}

const CVDocument = ({ person, work, studies, technical }: CVData) => (
    <Document>
        <Page size="A4" style={pdfStyles.page}>
            {/* Header - full width */}
            <View style={pdfStyles.header}>
                <Text style={pdfStyles.name}>{person.name}</Text>
                <Text style={pdfStyles.role}>{person.role}</Text>
                <Text style={{ fontSize: 9, color: '#666' }}>{person.location}</Text>
            </View>

            {/* Two columns layout */}
            <View style={{ flexDirection: 'row' }}>
                {/* LEFT COLUMN - 60% */}
                <View style={{ flex: 60, marginRight: 15 }}>
                    {/* Work Experience */}
                    <View style={pdfStyles.section} wrap={false}>
                        <Text style={pdfStyles.sectionTitle}>{work.title}</Text>
                        {work.experiences.map((exp, i) => (
                            <View key={i} style={pdfStyles.experienceItem} wrap={false}>
                                <View style={pdfStyles.companyRow}>
                                    <Text style={pdfStyles.company}>{exp.company}</Text>
                                    <Text style={pdfStyles.timeframe}>{exp.timeframe}</Text>
                                </View>
                                <Text style={pdfStyles.experienceRole}>{exp.role}</Text>
                                {exp.achievements.map((achievement, j) => (
                                    <Text key={j} style={pdfStyles.achievement}>• {achievement}</Text>
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* Education */}
                    <View style={pdfStyles.section} wrap={false}>
                        <Text style={pdfStyles.sectionTitle}>{studies.title}</Text>
                        {studies.institutions.map((inst, i) => (
                            <View key={i} style={pdfStyles.institution} wrap={false}>
                                <Text style={pdfStyles.institutionName}>{inst.name}</Text>
                                <Text style={pdfStyles.institutionDesc}>{inst.description}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* RIGHT COLUMN - 40% */}
                <View style={{ flex: 40 }}>
                    {/* Technical Skills */}
                    <View style={pdfStyles.section} wrap={false}>
                        <Text style={pdfStyles.sectionTitle}>{technical.title}</Text>
                        {technical.skills.map((skill, i) => (
                            <View key={i} style={pdfStyles.skillItem} wrap={false}>
                                <Text style={pdfStyles.skillTitle}>{skill.title}</Text>
                                {skill.tags && skill.tags.length > 0 && (
                                    <View style={pdfStyles.skillTags}>
                                        {skill.tags.map((tag, j) => (
                                            <Text key={j} style={pdfStyles.tag}>{tag.name}</Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

interface DownloadCVButtonProps extends CVData {
    label?: string;
    loadingLabel?: string;
    size?: 's' | 'm' | 'l';
    variant?: 'primary' | 'secondary' | 'tertiary';
}

export function DownloadCVButton({
                                     person,
                                     work,
                                     studies,
                                     technical,
                                     label = 'Download CV',
                                     loadingLabel = 'Generating...',
                                     size = 'm',
                                     variant = 'secondary'
                                 }: DownloadCVButtonProps) {
    return (
        <PDFDownloadLink
            document={<CVDocument person={person} work={work} studies={studies} technical={technical} />}
            fileName={`${person.name.replace(/\s+/g, '_')}_CV.pdf`}
        >
            {({ loading }) => (
                <Button
                    prefixIcon="download"
                    label={loading ? loadingLabel : label}
                    size={size}
                    variant={variant}
                />
            )}
        </PDFDownloadLink>
    );
}