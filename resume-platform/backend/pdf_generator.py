from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from typing import Dict, Any, List

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.darkblue,
            spaceAfter=30,
            alignment=1  # Center alignment
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.darkblue,
            spaceBefore=20,
            spaceAfter=10,
            borderWidth=1,
            borderColor=colors.darkblue,
            borderPadding=5
        ))
    
    def generate_resume_pdf(self, resume_data: Dict[str, Any]) -> BytesIO:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch)
        story = []
        
        # Personal Details Section
        personal = resume_data.get('personal_details', {})
        if personal:
            # Name as title
            name = personal.get('full_name', 'Resume')
            story.append(Paragraph(name, self.styles['CustomTitle']))
            
            # Contact info
            contact_info = []
            if personal.get('email'):
                contact_info.append(f"Email: {personal['email']}")
            if personal.get('phone'):
                contact_info.append(f"Phone: {personal['phone']}")
            if personal.get('location'):
                contact_info.append(f"Location: {personal['location']}")
            
            if contact_info:
                story.append(Paragraph(" | ".join(contact_info), self.styles['Normal']))
                story.append(Spacer(1, 20))
        
        # Summary Section
        summary = resume_data.get('summary')
        if summary:
            story.append(Paragraph("Professional Summary", self.styles['SectionHeader']))
            story.append(Paragraph(summary, self.styles['Normal']))
            story.append(Spacer(1, 15))
        
        # Experience Section
        experience = resume_data.get('experience', [])
        if experience:
            story.append(Paragraph("Professional Experience", self.styles['SectionHeader']))
            for exp in experience:
                # Company and position
                title = f"<b>{exp.get('position', '')}</b> at {exp.get('company', '')}"
                story.append(Paragraph(title, self.styles['Normal']))
                
                # Dates and location
                date_info = []
                if exp.get('start_date'):
                    end_date = exp.get('end_date', 'Present')
                    date_info.append(f"{exp['start_date']} - {end_date}")
                if exp.get('location'):
                    date_info.append(exp['location'])
                
                if date_info:
                    story.append(Paragraph(" | ".join(date_info), self.styles['Normal']))
                
                # Description
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], self.styles['Normal']))
                
                story.append(Spacer(1, 10))
        
        # Education Section
        education = resume_data.get('education', [])
        if education:
            story.append(Paragraph("Education", self.styles['SectionHeader']))
            for edu in education:
                # Degree and institution
                title = f"<b>{edu.get('degree', '')}</b> in {edu.get('field_of_study', '')}"
                story.append(Paragraph(title, self.styles['Normal']))
                
                # Institution and dates
                inst_info = []
                if edu.get('institution'):
                    inst_info.append(edu['institution'])
                if edu.get('start_date'):
                    end_date = edu.get('end_date', 'Present')
                    inst_info.append(f"{edu['start_date']} - {end_date}")
                
                if inst_info:
                    story.append(Paragraph(" | ".join(inst_info), self.styles['Normal']))
                
                if edu.get('grade'):
                    story.append(Paragraph(f"Grade: {edu['grade']}", self.styles['Normal']))
                
                story.append(Spacer(1, 10))
        
        # Skills Section
        skills = resume_data.get('skills', [])
        if skills:
            story.append(Paragraph("Skills", self.styles['SectionHeader']))
            skills_text = ", ".join(skills)
            story.append(Paragraph(skills_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
