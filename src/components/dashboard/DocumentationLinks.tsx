
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, GitBranch, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DocumentationLinks: React.FC = () => {
  const docs = [
    {
      title: 'System Architecture',
      description: 'Learn about our knowledge base architecture and data flow',
      icon: <FileText className="h-4 w-4" />,
      path: '/__debug'
    },
    {
      title: 'Prompt Logging',
      description: 'View and analyze AI interactions for improved context',
      icon: <BookOpen className="h-4 w-4" />,
      path: '/__debug'
    },
    {
      title: 'Developer Tools',
      description: 'Debug and validate the knowledge base system',
      icon: <Terminal className="h-4 w-4" />,
      path: '/__debug'
    },
    {
      title: 'CI Integration',
      description: 'Learn how our safeguards protect knowledge integrity',
      icon: <GitBranch className="h-4 w-4" />,
      path: '/__debug'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {docs.map((doc, index) => (
        <Card key={index} className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {doc.icon}
              </div>
              <CardTitle className="text-sm font-medium">{doc.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{doc.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to={doc.path}>
                View Documentation
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DocumentationLinks;
