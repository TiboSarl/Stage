num_texture = 11;

I = imread(['pavejointcentres.png']);

[l,c,~] = size(I);
centres = [];

fid = fopen(['pavejoint.txt'],'w');
fprintf(fid,['var centresTexturePaveJoint = ' ]);
fprintf(fid,'[');
premiere_fois = true;
for i=1:l
    for j=1:c
        if (I(i,j,1) == 255 && I(i,j,2) == 0 && I(i,j,3) == 0)
            centres = [centres; i,j];
            if (~premiere_fois)
                fprintf(fid,',');
            end
            fprintf(fid,'[%i,', i);
            fprintf(fid,'%i]', j);
            premiere_fois = false;
        end
    end
end

fprintf(fid,'];');
fclose(fid);