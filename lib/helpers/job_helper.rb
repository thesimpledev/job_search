def pass_or_fail_class(job)
  job.passing_score? ? 'job-points-passing' : 'job-points-failing'
end