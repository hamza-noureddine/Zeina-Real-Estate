// Data safety and backup utilities

import { supabase } from '@/lib/supabase';

// Data validation and integrity checks
export const validateDataIntegrity = async (): Promise<{
  valid: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  try {
    // Check for orphaned data
    const { data: orphanedViews, error: viewsError } = await supabase
      .from('property_views')
      .select('property_id')
      .not('property_id', 'in', `(SELECT id FROM properties)`);
    
    if (viewsError) {
      issues.push('Failed to check orphaned property views');
    } else if (orphanedViews && orphanedViews.length > 0) {
      issues.push(`Found ${orphanedViews.length} orphaned property views`);
      recommendations.push('Clean up orphaned property views');
    }
    
    // Check for orphaned inquiries
    const { data: orphanedInquiries, error: inquiriesError } = await supabase
      .from('property_inquiries')
      .select('property_id')
      .not('property_id', 'in', `(SELECT id FROM properties)`);
    
    if (inquiriesError) {
      issues.push('Failed to check orphaned inquiries');
    } else if (orphanedInquiries && orphanedInquiries.length > 0) {
      issues.push(`Found ${orphanedInquiries.length} orphaned inquiries`);
      recommendations.push('Clean up orphaned inquiries');
    }
    
    // Check for properties with invalid data
    const { data: invalidProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title, price, area')
      .or('price.lt.0,area.lte.0,title.is.null');
    
    if (propertiesError) {
      issues.push('Failed to check invalid properties');
    } else if (invalidProperties && invalidProperties.length > 0) {
      issues.push(`Found ${invalidProperties.length} properties with invalid data`);
      recommendations.push('Fix invalid property data');
    }
    
    // Check for duplicate properties
    const { data: duplicates, error: duplicatesError } = await supabase
      .from('properties')
      .select('title, location, price')
      .not('title', 'is', null);
    
    if (duplicatesError) {
      issues.push('Failed to check for duplicates');
    } else if (duplicates) {
      const titleLocationMap = new Map();
      duplicates.forEach(prop => {
        const key = `${prop.title}-${prop.location}`;
        if (titleLocationMap.has(key)) {
          titleLocationMap.set(key, titleLocationMap.get(key) + 1);
        } else {
          titleLocationMap.set(key, 1);
        }
      });
      
      const duplicateCount = Array.from(titleLocationMap.values()).filter(count => count > 1).length;
      if (duplicateCount > 0) {
        issues.push(`Found ${duplicateCount} potential duplicate properties`);
        recommendations.push('Review and merge duplicate properties');
      }
    }
    
    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  } catch (error) {
    return {
      valid: false,
      issues: ['Failed to validate data integrity'],
      recommendations: ['Check database connection and permissions']
    };
  }
};

// Backup utilities
export const createDataBackup = async (): Promise<{
  success: boolean;
  backupId?: string;
  error?: string;
}> => {
  try {
    // Create backup using Supabase function
    const { data, error } = await supabase.rpc('backup_properties');
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      backupId: data[0]?.backup_id 
    };
  } catch (error) {
    return { success: false, error: 'Backup failed' };
  }
};

// Export data to JSON
export const exportDataToJSON = async (): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    // Get all properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*');
    
    if (propertiesError) {
      return { success: false, error: propertiesError.message };
    }
    
    // Get all inquiries
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('property_inquiries')
      .select('*');
    
    if (inquiriesError) {
      return { success: false, error: inquiriesError.message };
    }
    
    // Get analytics data
    const { data: views, error: viewsError } = await supabase
      .from('property_views')
      .select('property_id, viewed_at, user_ip');
    
    if (viewsError) {
      return { success: false, error: viewsError.message };
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      properties: properties || [],
      inquiries: inquiries || [],
      views: views || [],
      metadata: {
        totalProperties: properties?.length || 0,
        totalInquiries: inquiries?.length || 0,
        totalViews: views?.length || 0
      }
    };
    
    return { success: true, data: exportData };
  } catch (error) {
    return { success: false, error: 'Export failed' };
  };
};

// Download data as JSON file
export const downloadDataAsJSON = async (): Promise<void> => {
  try {
    const result = await exportDataToJSON();
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    const dataStr = JSON.stringify(result.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zeina-real-estate-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Data cleanup utilities
export const cleanupOrphanedData = async (): Promise<{
  success: boolean;
  cleaned: number;
  error?: string;
}> => {
  try {
    let cleaned = 0;
    
    // Clean orphaned property views
    const { data: orphanedViews, error: viewsError } = await supabase
      .from('property_views')
      .delete()
      .not('property_id', 'in', `(SELECT id FROM properties)`);
    
    if (viewsError) {
      return { success: false, error: viewsError.message };
    }
    
    // Clean orphaned inquiries
    const { data: orphanedInquiries, error: inquiriesError } = await supabase
      .from('property_inquiries')
      .delete()
      .not('property_id', 'in', `(SELECT id FROM properties)`);
    
    if (inquiriesError) {
      return { success: false, error: inquiriesError.message };
    }
    
    // Count cleaned records (approximate)
    cleaned = (orphanedViews?.length || 0) + (orphanedInquiries?.length || 0);
    
    return { success: true, cleaned };
  } catch (error) {
    return { success: false, error: 'Cleanup failed' };
  }
};

// Data monitoring and alerts
export const monitorDataHealth = async (): Promise<{
  healthy: boolean;
  metrics: {
    totalProperties: number;
    totalInquiries: number;
    totalViews: number;
    averageViewsPerProperty: number;
    recentActivity: number;
  };
  alerts: string[];
}> => {
  const alerts: string[] = [];
  
  try {
    // Get basic metrics
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, created_at, view_count');
    
    if (propertiesError) {
      alerts.push('Failed to fetch properties data');
    }
    
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('property_inquiries')
      .select('id, created_at');
    
    if (inquiriesError) {
      alerts.push('Failed to fetch inquiries data');
    }
    
    const { data: views, error: viewsError } = await supabase
      .from('property_views')
      .select('id, viewed_at');
    
    if (viewsError) {
      alerts.push('Failed to fetch views data');
    }
    
    const totalProperties = properties?.length || 0;
    const totalInquiries = inquiries?.length || 0;
    const totalViews = views?.length || 0;
    const averageViewsPerProperty = totalProperties > 0 ? totalViews / totalProperties : 0;
    
    // Check for recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentInquiries = inquiries?.filter(inq => inq.created_at > oneDayAgo).length || 0;
    const recentViews = views?.filter(view => view.viewed_at > oneDayAgo).length || 0;
    const recentActivity = recentInquiries + recentViews;
    
    // Generate alerts
    if (totalProperties === 0) {
      alerts.push('No properties found in database');
    }
    
    if (averageViewsPerProperty < 1 && totalProperties > 0) {
      alerts.push('Low average views per property - consider SEO improvements');
    }
    
    if (recentActivity === 0 && totalProperties > 0) {
      alerts.push('No recent activity - check if site is working properly');
    }
    
    // Check for properties with no views
    const propertiesWithNoViews = properties?.filter(prop => !prop.view_count || prop.view_count === 0).length || 0;
    if (propertiesWithNoViews > totalProperties * 0.5) {
      alerts.push('More than 50% of properties have no views');
    }
    
    return {
      healthy: alerts.length === 0,
      metrics: {
        totalProperties,
        totalInquiries,
        totalViews,
        averageViewsPerProperty: Math.round(averageViewsPerProperty * 100) / 100,
        recentActivity
      },
      alerts
    };
  } catch (error) {
    return {
      healthy: false,
      metrics: {
        totalProperties: 0,
        totalInquiries: 0,
        totalViews: 0,
        averageViewsPerProperty: 0,
        recentActivity: 0
      },
      alerts: ['Failed to monitor data health']
    };
  }
};

// Data recovery utilities
export const recoverDeletedProperty = async (propertyId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    // Check if property exists in backup tables
    const { data: backup, error: backupError } = await supabase
      .from('properties_backup')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (backupError || !backup) {
      return { success: false, error: 'Property not found in backups' };
    }
    
    // Restore property
    const { data: restored, error: restoreError } = await supabase
      .from('properties')
      .insert([backup])
      .select()
      .single();
    
    if (restoreError) {
      return { success: false, error: restoreError.message };
    }
    
    return { success: true, data: restored };
  } catch (error) {
    return { success: false, error: 'Recovery failed' };
  }
};

// Automated data maintenance
export const performDataMaintenance = async (): Promise<{
  success: boolean;
  actions: string[];
  error?: string;
}> => {
  const actions: string[] = [];
  
  try {
    // 1. Validate data integrity
    const integrityCheck = await validateDataIntegrity();
    if (!integrityCheck.valid) {
      actions.push('Data integrity issues found');
    }
    
    // 2. Clean orphaned data
    const cleanup = await cleanupOrphanedData();
    if (cleanup.success && cleanup.cleaned > 0) {
      actions.push(`Cleaned ${cleanup.cleaned} orphaned records`);
    }
    
    // 3. Create backup
    const backup = await createDataBackup();
    if (backup.success) {
      actions.push(`Created backup: ${backup.backupId}`);
    }
    
    // 4. Monitor health
    const health = await monitorDataHealth();
    if (!health.healthy) {
      actions.push(`Health issues: ${health.alerts.join(', ')}`);
    }
    
    return { success: true, actions };
  } catch (error) {
    return { success: false, error: 'Maintenance failed', actions };
  }
};
