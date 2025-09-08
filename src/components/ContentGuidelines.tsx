import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/data/translations';
import { getContentGuidelines, checkContentQuality } from '@/utils/translationUtils';
import { CheckCircle, AlertCircle, Lightbulb, Globe } from 'lucide-react';

interface ContentGuidelinesProps {
  property?: any;
  showQualityCheck?: boolean;
}

const ContentGuidelines: React.FC<ContentGuidelinesProps> = ({ 
  property, 
  showQualityCheck = false 
}) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const guidelines = getContentGuidelines(language);
  
  const qualityCheck = property && showQualityCheck ? checkContentQuality(property, language) : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {guidelines.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Check */}
        {qualityCheck && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {qualityCheck.hasIssues ? (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className="font-semibold">
                {language === 'ar' ? 'جودة المحتوى' : 'Content Quality'}
              </span>
              <Badge variant={qualityCheck.hasIssues ? 'destructive' : 'default'}>
                {qualityCheck.score}%
              </Badge>
            </div>
            
            {qualityCheck.hasIssues && (
              <div className="space-y-2">
                <div className="text-sm text-orange-600">
                  <strong>{language === 'ar' ? 'المشاكل:' : 'Issues:'}</strong>
                </div>
                <ul className="text-sm space-y-1">
                  {qualityCheck.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-sm text-blue-600 mt-3">
                  <strong>{language === 'ar' ? 'الاقتراحات:' : 'Suggestions:'}</strong>
                </div>
                <ul className="text-sm space-y-1">
                  {qualityCheck.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Professional Tips */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {language === 'ar' ? 'نصائح مهنية' : 'Professional Tips'}
          </h4>
          <ul className="space-y-2 text-sm">
            {guidelines.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Guidelines */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            {language === 'ar' ? 'إرشادات اللغة' : 'Language Guidelines'}
          </h4>
          <div className="text-sm space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800 mb-1">
                {language === 'ar' ? 'المحتوى باللغة العربية:' : 'Arabic Content:'}
              </div>
              <ul className="text-blue-700 space-y-1">
                <li>• {language === 'ar' ? 'استخدم اللغة العربية الفصحى أو العامية اللبنانية' : 'Use formal Arabic or Lebanese dialect'}</li>
                <li>• {language === 'ar' ? 'اذكر المواقع بالعربية (بيروت، جبل لبنان، إلخ)' : 'Mention locations in Arabic (بيروت، جبل لبنان، etc.)'}</li>
                <li>• {language === 'ar' ? 'استخدم الأرقام العربية أو الإنجليزية' : 'Use Arabic or English numerals'}</li>
              </ul>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800 mb-1">
                {language === 'ar' ? 'المحتوى باللغة الإنجليزية:' : 'English Content:'}
              </div>
              <ul className="text-green-700 space-y-1">
                <li>• {language === 'ar' ? 'استخدم الإنجليزية المهنية والواضحة' : 'Use professional and clear English'}</li>
                <li>• {language === 'ar' ? 'اذكر المواقع بالإنجليزية (Beirut, Mount Lebanon, etc.)' : 'Mention locations in English (Beirut, Mount Lebanon, etc.)'}</li>
                <li>• {language === 'ar' ? 'استخدم الأرقام الإنجليزية' : 'Use English numerals'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">
            {language === 'ar' ? 'أمثلة جيدة:' : 'Good Examples:'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium mb-1">
                {language === 'ar' ? 'عنوان جيد:' : 'Good Title:'}
              </div>
              <div className="text-muted-foreground">
                {guidelines.examples.goodTitle}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium mb-1">
                {language === 'ar' ? 'وصف جيد:' : 'Good Description:'}
              </div>
              <div className="text-muted-foreground">
                {guidelines.examples.goodDescription}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium mb-1">
                {language === 'ar' ? 'موقع جيد:' : 'Good Location:'}
              </div>
              <div className="text-muted-foreground">
                {guidelines.examples.goodLocation}
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual Content Note */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800 mb-1">
                {language === 'ar' ? 'نصيحة للمحتوى ثنائي اللغة:' : 'Bilingual Content Tip:'}
              </div>
              <div className="text-yellow-700">
                {language === 'ar' 
                  ? 'يمكنك كتابة المحتوى بالعربية أو الإنجليزية. سيتم عرضه تلقائياً باللغة المفضلة للمستخدم مع إشارة إلى اللغة الأصلية.'
                  : 'You can write content in Arabic or English. It will automatically display in the user\'s preferred language with an indicator of the original language.'
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentGuidelines;
