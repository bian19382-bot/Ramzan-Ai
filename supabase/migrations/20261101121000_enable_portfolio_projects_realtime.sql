do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'portfolio_projects'
  ) then
    alter publication supabase_realtime add table public.portfolio_projects;
  end if;
end
$$;