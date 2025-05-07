
-- Function to get column information for a table
-- This allows our JavaScript code to query table structure
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT
) AS $$
BEGIN
  RETURN QUERY
    SELECT 
      c.column_name::TEXT, 
      c.data_type::TEXT,
      c.is_nullable::TEXT
    FROM 
      information_schema.columns c
    WHERE 
      c.table_schema = 'public' AND 
      c.table_name = table_name
    ORDER BY 
      c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to use this function
GRANT EXECUTE ON FUNCTION public.get_table_columns TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_columns TO anon;
GRANT EXECUTE ON FUNCTION public.get_table_columns TO service_role;

COMMENT ON FUNCTION public.get_table_columns IS 'Get column information for a specified table';
