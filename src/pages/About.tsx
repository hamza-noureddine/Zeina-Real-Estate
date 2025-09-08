import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, Users, Star, Quote, 
  MapPin, Phone, Mail, Clock 
} from 'lucide-react';

const About = () => {
  const achievements = [
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Users, label: 'Happy Families', value: '500+' },
    { icon: Star, label: 'Years Experience', value: '15+' },
    { icon: MapPin, label: 'Cities Served', value: '12' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'First-time Homebuyer',
      content: 'The team made my dream of homeownership a reality. Their expertise and dedication throughout the entire process was exceptional.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Property Investor',
      content: 'Professional, knowledgeable, and always available when needed. They helped me build a fantastic investment portfolio.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Luxury Home Seller',
      content: 'Sold our luxury home above asking price within two weeks. Their marketing strategy and network are unmatched.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About Estate Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            With over 15 years of experience in luxury real estate, we specialize in connecting 
            discerning clients with exceptional properties in the world's most prestigious locations.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {achievement.value}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {achievement.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="fade-in">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2009, Estate Portfolio began with a simple mission: to redefine 
                the luxury real estate experience through personalized service, market expertise, 
                and unwavering commitment to our clients' success.
              </p>
              <p>
                Our team of seasoned professionals brings together decades of combined experience 
                in luxury real estate, architecture, and investment advisory. We understand that 
                buying or selling a home is one of life's most significant decisions.
              </p>
              <p>
                Today, we're proud to be recognized as one of the leading luxury real estate 
                firms, having facilitated over $2 billion in transactions across prime markets 
                worldwide.
              </p>
            </div>
          </div>
          <div className="fade-in slide-in-right">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Modern luxury home"
              className="w-full h-96 object-cover rounded-lg shadow-elegant"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'We maintain the highest standards in everything we do, from property selection to client service.',
                icon: Award
              },
              {
                title: 'Integrity',
                description: 'Transparency and honesty form the foundation of our relationships with clients and partners.',
                icon: Star
              },
              {
                title: 'Innovation',
                description: 'We leverage cutting-edge technology and marketing strategies to deliver exceptional results.',
                icon: Users
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center shadow-card fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-primary mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-accent mr-3" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
 
      </div>
    </div>
  );
};

export default About;