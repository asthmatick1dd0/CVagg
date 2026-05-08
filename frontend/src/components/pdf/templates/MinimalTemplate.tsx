import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { WebIcon, CalendarIcon, MailIcon, PhoneIcon, MapPinIcon, GithubIcon } from "@/assets/PdfIcons";
import { getSkillName } from "@/constants/skills";
import { PREDEFINED_SKILLS } from '@/constants/skills';
import { 
  categoryOrder, 
  getAdaptiveNameFontSize, 
  formatDate,
  formatBday,
  type ResumeDocumentProps 
} from "@/components/pdf/ResumeDocument";

Font.register({
  family: 'Open Sans',
  fonts: [
    { 
      src: '/fonts/OpenSans-Regular.ttf', 
      fontWeight: 'normal',
    },
    { 
      src: '/fonts/OpenSans-Bold.ttf', 
      fontWeight: 'bold',
    },
    { 
      src: '/fonts/OpenSans-Italic.ttf', 
      fontStyle: 'italic', 
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Open Sans', 
  },
  // Левая колонка (Темная)
  leftColumn: {
    width: '35%',
    backgroundColor: '#2E313D',
    padding: 20,
    color: '#FFF',
  },
  // Правая колонка (Светлая)
  rightColumn: {
    width: '65%',
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 20,
  },
  
  // -- Стили Левой колонки --
  sidebarTitle: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    color: '#A0A0A0',
    fontWeight: 'bold', // Теперь будет использоваться OpenSans-Bold
    borderBottomWidth: 1,
    borderBottomColor: '#5D6083',
    paddingBottom: 5,
  },
  skillContainer: {
    marginBottom: 10,
  },
  categoryBox: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  skillText: {
    fontSize: 10,
    marginBottom: 3,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    backgroundColor: '#7B7EB7',
    marginRight: 8,
  },
  listText: {
    fontSize: 10,
    color: '#D3D3D3',
  },

  // -- Стили Правой колонки --
  headerBox: {
    backgroundColor: '#5D6083',
    padding: 20,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D3D3D3',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  headerTextContainer: {
    flex: 1,
    flexWrap: 'nowrap',
  },
  name: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 'bold', // OpenSans-Bold
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  contactText: {
    fontSize: 9,
    color: '#FFF',
    marginLeft: 5,
  },

  // Секции контента
  sectionTitleBox: {
    backgroundColor: '#5D6083',
    padding: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sectionTitleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold', // OpenSans-Bold
    textTransform: 'uppercase',
  },
  entryContainer: {
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Важно: выравнивание по верху, если текст станет многострочным
    width: '100%',
    marginBottom: 2,
  },
  titleWrapper: {
    flex: 1,               // Занимает всё доступное пространство
    marginRight: 15,       // Минимальный гарантированный отступ от даты
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold', // OpenSans-Bold
    color: '#000',
  },
  dateWrapper: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  entryDate: {
    fontSize: 9,
    color: '#666',
    fontStyle: 'italic', // OpenSans-Italic
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#444',
    marginBottom: 4,
  },
  entryDescription: {
    fontSize: 9,
    color: '#333',
    lineHeight: 1.4,
    textAlign: 'justify',
  },
});

const MinimalTemplate: React.FC<ResumeDocumentProps> = ({ data, avatarBase64 }) => {
  const { personalInfo, education, experience, skills, custom } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* === ЛЕВАЯ КОЛОНКА === */}
        {/* SKILLS / LANGUAGES */}
        <View style={styles.leftColumn}>
        {skills && skills.length > 0 && (
          <>
            <Text style={styles.sidebarTitle}>НАВЫКИ</Text>
            {(() => {
              const skillsByCategory = skills.reduce((acc, skill) => {
                const skillInfo = PREDEFINED_SKILLS.find(s => s.id === skill.SkillId);
                const category = skillInfo?.category || "Другое";
                
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(skill);
                return acc;
              }, {} as Record<string, typeof skills>);
              
              const sortedCategories = Object.keys(skillsByCategory).sort((a, b) => {
                const indexA = categoryOrder.indexOf(a);
                const indexB = categoryOrder.indexOf(b);
                if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
              });
              
              return sortedCategories.map(category => (
                <View key={category} style={styles.categoryBox}>
                  <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
                  {skillsByCategory[category].map((skill, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.skillText}>
                        {getSkillName(skill.SkillId)}
                      </Text>
                    </View>
                  ))}
                </View>
              ));
            })()}
          </>
        )}
        </View>

        {/* === ПРАВАЯ КОЛОНКА === */}
        <View style={styles.rightColumn}>
          
          {/* HEADER */}
          <View style={styles.headerBox}>
            <View style={styles.avatarContainer}>
              {avatarBase64 ? (
                <Image 
                  src={avatarBase64} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={{ width: 80, height: 80, backgroundColor: '#ccc' }} />
              )}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.name, 
                { 
                  fontSize: getAdaptiveNameFontSize(`${personalInfo?.name || ''} ${personalInfo?.surname || ''}`.trim())
                }
              ]}
              >
              {personalInfo?.name} {personalInfo?.surname}
              </Text>
              <Text style={{ color: '#FFF', fontSize: 10, marginBottom: 5 }}>
                {personalInfo?.jobTitle}
              </Text>
              
              {personalInfo?.email && (
                <View style={styles.contactRow}>
                  <MailIcon color="#FFF" size={10} />
                  <Text style={styles.contactText}>{personalInfo.email}</Text>
                </View>
              )}
              {personalInfo?.phone && (
                <View style={styles.contactRow}>
                  <PhoneIcon color="#FFF" size={10} />
                  <Text style={styles.contactText}>{personalInfo.phone}</Text>
                </View>
              )}
              {personalInfo?.address && (
                <View style={styles.contactRow}>
                  <MapPinIcon color="#FFF" size={10} />
                  <Text style={styles.contactText}>{personalInfo.address}</Text>
                </View>
              )}
              {personalInfo?.birthDate && (
                <View style={styles.contactRow}>
                  <CalendarIcon color="#FFF" size={10} />   
                    <Text style={styles.contactText}>{formatBday(personalInfo.birthDate)}</Text>
                </View>
              )}
              {personalInfo?.website && (
                <View style={styles.contactRow}>
                  <WebIcon color="#FFF" size={10} />
                  <Text style={styles.contactText}>{personalInfo.website.replace(/^https?:\/\//, '')}</Text>
                </View>
              )}
              {personalInfo?.github && (
                <View style={styles.contactRow}>
                  <GithubIcon color="#FFF" size={10} />
                  <Text style={styles.contactText}>{personalInfo.github.replace(/^https?:\/\//, '')}</Text>
                </View>
              )}
            </View>
          </View>

          {/* EDUCATION */}
          {education && education.length > 0 && (
          <>
            <View style={styles.sectionTitleBox}>
              <Text style={styles.sectionTitleText}>ОБРАЗОВАНИЕ</Text>
            </View>
            {education.map((edu, index) => (
              <View key={index} style={styles.entryContainer}>
                
                <View style={styles.entryHeader}>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.entryTitle}>• {edu.university}</Text>
                  </View>
                  
                  <View style={styles.dateWrapper}>
                    <CalendarIcon color="#666" size={8} />
                    <Text style={styles.entryDate}>
                      {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Настоящее время"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.entrySubtitle}>{edu.degree} - {edu.faculty}</Text>
                <Text style={styles.entryDescription}>{edu.major}</Text>
              </View>
            ))}
          </>
        )}

          {/* EXPERIENCE */}
          {experience && experience.length > 0 && (
            <>
                <View style={styles.sectionTitleBox}>
                  <Text style={styles.sectionTitleText}>ОПЫТ РАБОТЫ</Text>
                </View>
              {experience.map((exp, index) => (
                <View key={index} style={styles.entryContainer}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>• {exp.company}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CalendarIcon color="#666" size={8} />
                        <Text style={styles.entryDate}>
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Настоящее время"}
                        </Text>
                    </View>
                  </View>
                  <Text style={styles.entrySubtitle}>{exp.position}</Text>
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                </View>
              ))}
            </>
          )}

          {/* CUSTOM FIELDS (Разное) */}
          {custom && custom.map((item, index) => (
            <>
              <View key={index} style={styles.sectionTitleBox}>
                <Text style={styles.sectionTitleText}>{item.title}</Text>
              </View>
                <View style={styles.entrySubtitle}>
                  <Text style={styles.entrySubtitle}>{item.content}</Text>
                </View>
            </>
            ))}

        </View>
      </Page>
    </Document>
  );
};

export default MinimalTemplate;