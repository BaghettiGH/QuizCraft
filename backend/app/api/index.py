# Absolute minimal test - no imports from your app at all
from mangum import Mangum

def handler(event, context):
    """Minimal handler to test if Python even runs"""
    import json
    import sys
    import os
    import traceback
    
    # Check if this is an HTTP request
    if 'rawPath' in event:
        path = event.get('rawPath', '/')
        
        if path == '/':
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Python is working!',
                    'python_version': sys.version,
                    'cwd': os.getcwd(),
                    'env_vars': list(os.environ.keys())
                }),
                'headers': {'Content-Type': 'application/json'}
            }
        
        elif path == '/test-config':
            errors = []
            
            # Test 1: Check env vars
            try:
                supabase_url = os.getenv('SUPABASE_URL')
                supabase_key = os.getenv('SUPABASE_KEY')
                errors.append({
                    'test': 'env_vars',
                    'status': 'OK',
                    'supabase_url_exists': bool(supabase_url),
                    'supabase_key_exists': bool(supabase_key)
                })
            except Exception as e:
                errors.append({'test': 'env_vars', 'status': 'FAIL', 'error': str(e)})
            
            # Test 2: Import pydantic_settings
            try:
                from pydantic_settings import BaseSettings
                errors.append({'test': 'pydantic_settings', 'status': 'OK'})
            except Exception as e:
                errors.append({'test': 'pydantic_settings', 'status': 'FAIL', 'error': str(e), 'trace': traceback.format_exc()})
            
            # Test 3: Import app.core.config
            try:
                sys.path.insert(0, os.getcwd())
                from app.core.config import settings
                errors.append({
                    'test': 'app.core.config',
                    'status': 'OK',
                    'settings_loaded': True
                })
            except Exception as e:
                errors.append({
                    'test': 'app.core.config',
                    'status': 'FAIL',
                    'error': str(e),
                    'trace': traceback.format_exc()
                })
            
            # Test 4: Import supabase
            try:
                from supabase import create_client
                errors.append({'test': 'supabase_import', 'status': 'OK'})
            except Exception as e:
                errors.append({'test': 'supabase_import', 'status': 'FAIL', 'error': str(e), 'trace': traceback.format_exc()})
            
            return {
                'statusCode': 200,
                'body': json.dumps({'tests': errors}),
                'headers': {'Content-Type': 'application/json'}
            }
    
    return {
        'statusCode': 404,
        'body': json.dumps({'error': 'Not found'}),
        'headers': {'Content-Type': 'application/json'}
    }