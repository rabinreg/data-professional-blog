import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the author — a data engineer writing about pipelines, cloud, and the modern data stack.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About</h1>
      <div className="prose prose-gray prose-lg max-w-none prose-a:text-violet-600 prose-headings:font-bold">
        <p>
          Hi, I&apos;m a data engineer with experience building large-scale data pipelines, real-time streaming systems,
          and cloud-native data infrastructure. This blog is where I share what I learn — from hands-on engineering
          challenges to opinions on the modern data stack.
        </p>
        <p>
          Topics I write about include Apache Spark, Kafka, dbt, Airflow, data lakehouse architectures,
          cloud platforms (AWS, GCP, Azure), and emerging trends in data engineering.
        </p>
        <h2>Why this blog?</h2>
        <p>
          Writing helps me think clearly. I publish here to give back to the community that taught me so much,
          and to document my journey as a practitioner in this rapidly evolving field.
        </p>
        <h2>Get in touch</h2>
        <p>
          You can reach me via{' '}
          <a href="https://linkedin.com/in/rabinreg" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{' '}
          or find my open-source work on{' '}
          <a href="https://github.com/rabinreg" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          . I&apos;m always happy to connect with fellow engineers.
        </p>
      </div>
    </div>
  );
}
